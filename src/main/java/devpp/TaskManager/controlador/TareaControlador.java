package devpp.TaskManager.controlador;

import devpp.TaskManager.modelo.Tarea;
import devpp.TaskManager.servicio.ITareaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tareas")
@CrossOrigin(origins = "http://localhost:8080")
public class TareaControlador {
    @Autowired
    private ITareaServicio iTareaServicio;

    @GetMapping
    public List<Tarea> listaTareas(){
        return iTareaServicio.listarTareas();
    }

    @GetMapping("/{id}")
    public Tarea listaTareaPorId(@PathVariable Integer id){
        return iTareaServicio.listarTareaPorId(id);
    }

    @PostMapping
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea tarea){
        Tarea tareaGuardar = iTareaServicio.guardarTarea(tarea);
        return ResponseEntity.ok(tareaGuardar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarTarea(@PathVariable Integer id){
        if(iTareaServicio.listarTareaPorId(id)!=null){
            iTareaServicio.eliminarTarea(id);
            return ResponseEntity.ok("Tarea eliminada con exito");
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}/completado")
    public ResponseEntity<Tarea> marcarCompletado(@PathVariable Integer id){
        if(iTareaServicio.listarTareaPorId(id)!=null){
            Tarea tarea = iTareaServicio.listarTareaPorId(id);
            if(tarea.getCompletado().equals("true")){
                tarea.setCompletado("false");
            }else if(tarea.getCompletado().equals("false")){
                tarea.setCompletado("true");
            }
            Tarea tareaActualizada = iTareaServicio.guardarTarea(tarea);
            return ResponseEntity.ok(tareaActualizada);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
