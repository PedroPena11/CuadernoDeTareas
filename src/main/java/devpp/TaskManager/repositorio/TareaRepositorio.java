package devpp.TaskManager.repositorio;

import devpp.TaskManager.modelo.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepositorio extends JpaRepository<Tarea,Integer> {
}
