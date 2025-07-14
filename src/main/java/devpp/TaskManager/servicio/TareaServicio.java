package devpp.TaskManager.servicio;

import devpp.TaskManager.modelo.Tarea;
import devpp.TaskManager.repositorio.TareaRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaServicio implements ITareaServicio{

    private final TareaRepositorio tareaRepositorio;

    public TareaServicio(TareaRepositorio tareaRepositorio){
        this.tareaRepositorio = tareaRepositorio;
    }


    @Override
    public List<Tarea> listarTareas() {
        return tareaRepositorio.findAll();
    }

    @Override
    public void guardarTarea(Tarea tarea) {
        tareaRepositorio.save(tarea);

    }

    @Override
    public void eliminarTarea(Integer idTarea) {
        tareaRepositorio.deleteById(idTarea);
    }


}
