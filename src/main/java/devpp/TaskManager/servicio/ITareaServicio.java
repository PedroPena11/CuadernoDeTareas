package devpp.TaskManager.servicio;

import devpp.TaskManager.modelo.Tarea;

import java.util.List;

public interface ITareaServicio {

    List<Tarea> listarTareas();

    void guardarTarea(Tarea tarea);

    void eliminarTarea(Integer idTarea);

}
