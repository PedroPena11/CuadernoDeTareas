document.addEventListener('DOMContentLoaded',()=>{
    const taskForm = document.getElementById("tarea-form");
    const taskList = document.getElementById("lista-tareas");
    //const completadas = document.getElementById("conteo-completadas");
    //const nocompletadas = document.getElementById("conteo-nocompletadas");

    async function deleteTarea(tareaID) {
      if(!confirm("Estas seguro que deseas eliminar esta tarea?")){
        return;
      }  

      try{
        const response = await fetch( `http://localhost:8080/tareas/${tareaID}` , {
            method : "DELETE"
        });
        if(response.status === 200){
            console.log(`Tarea eliminada con exito ${tareaID}`)
            await obtenerMostrarTareas();
        }else if(response.status === 404){
            alert("La tarea que intentas eliminar no existe");
        }else{
            const errorText = await response.text(); 
            throw new Error(`Error al eliminar la tarea: ${response.status} ${response.statusText} - ${errorText}`);
        }
        }catch(Error){
            console.error('Hubo un problema con la operación de eliminación:', error);
            alert('No se pudo eliminar la tarea. Verifique la consola para más detalles.');
        }
    }

    async function actualizarEstadoTarea(tareaID) {
        try{
            const getResponse = await fetch(`http://localhost:8080/tareas/${tareaID}`)
            if(!getResponse.ok){
                throw new Error(`No se pudo obtener la tarea con ID ${tareaID} para actualizar.`);
            }

            const tareaActualizar = await getResponse.json();

            const putResponse = await fetch(`http://localhost:8080/tareas/${tareaID}/completado`,{
            method : "PUT",
            headers :{
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaActualizar)

            });

            if(!putResponse.ok){
                const errorData = await putResponse.json();
                throw new Error(`Error al actualizar la tarea: ${putResponse.status} ${putResponse.statusText} - ${errorData.message || ''}`);
            }

            const tareaActualizada = await putResponse.json();
            console.log('Tarea actualizada con éxito:', tareaActualizada);

            await obtenerMostrarTareas();

        }catch (error) {
            console.error('Hubo un problema al cambiar el estado de la tarea:', error);
            alert('No se pudo actualizar el estado de la tarea. Verifique la consola para más detalles.');
        
    }
}
    

    function actualizarCuentaTareas() {
        const taskListElement = document.getElementById('lista-tareas');
        const allListItems = taskListElement.querySelectorAll('li');
        
        let completedCount = 0;
        let incompleteCount = 0;

        allListItems.forEach(item => {
            
            if (item.classList.contains('completed')) {
                completedCount++;
            } else {
                incompleteCount++;
            }
    });

    document.getElementById('conteo-completadas').textContent = completedCount;
    document.getElementById('conteo-nocompletadas').textContent = incompleteCount;
}

    function renderTareas(tareas){
        taskList.innerHTML = '';

        if(tareas.length === 0){
            taskList.innerHTML = '<p>No hay tareas. ¡Anímate a agregar una!</p>';
            return;
        }

        tareas.forEach(tarea =>{
            const listItem = document.createElement('li');

            if(tarea.completado === "true"){
                listItem.classList.add("completed");
            }

            const tareaTexto = document.createElement('span');
            if(tarea.descripcion == ''){
                tareaTexto.textContent = tarea.titulo;
            }else{
                tareaTexto.textContent = tarea.titulo + ": '" + tarea.descripcion + "' ";
            }

            if(taskForm.descripcion){
                tareaTexto.titulo = tarea.descripcion;
            }

            const botonCompletada = document.createElement("button");
            botonCompletada.textContent = tarea.completado === "true" ? "Descompletar": "Completar"; 
            botonCompletada.classList.add("complete-btn");
            botonCompletada.addEventListener("click",async ()=>{
                await actualizarEstadoTarea(tarea.id);
            })

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener("click",async()=>{
                await deleteTarea(tarea.id);
            })

            
            listItem.appendChild(tareaTexto);
            listItem.appendChild(botonCompletada);
            listItem.appendChild(deleteButton);

            const taskActionsDiv = document.createElement('div');
            taskActionsDiv.classList.add('task-actions');
            taskActionsDiv.appendChild(botonCompletada);
            taskActionsDiv.appendChild(deleteButton);

    
            listItem.appendChild(tareaTexto);
            listItem.appendChild(taskActionsDiv); 

        
            taskList.appendChild(listItem);
        });

        actualizarCuentaTareas();

    }

    async function obtenerMostrarTareas() {
        try{
            const response = await fetch('http://localhost:8080/tareas');

            if(!response.ok){
                throw new Error(`Error al obtener tareas: ${response.status} ${response.statusText}`);
            }
            const tareas = await response.json();
            console.log("Tareas obtenidas: ",tareas);

            renderTareas(tareas);
        }catch(error){
            console.error('Hubo un problema al obtener las tareas:', error);
        alert('No se pudieron cargar las tareas. Verifique la consola para más detalles.');
        }
    }

    obtenerMostrarTareas();

    taskForm.addEventListener("submit",async (event)=>{
        event.preventDefault();
        const titulo = document.getElementById("title").value;
        const descripcion = document.getElementById("description").value;

        console.log(titulo,descripcion);

        const newTask = {
            titulo : titulo,
            descripcion : descripcion,
            completado : false
        };
        try{
            const respuesta = await fetch('http://localhost:8080/tareas',{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(newTask)
            });

            if(!respuesta.ok){
                const errorData = await respuesta.json();
                throw new Error(`Error al guardar la tarea: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
            }
            const tareaGuardada = await respuesta.json();
            console.log("Tarea guardada con exito: ", tareaGuardada);

            document.getElementById('title').value = ''; 
            document.getElementById('description').value = ''

            obtenerMostrarTareas();

        }catch (error) {
        console.error('Hubo un problema con la operación fetch:', error);
        alert('No se pudo guardar la tarea. Por favor, intente de nuevo. Verifique la consola para más detalles.');
    }
        
        
    })

    
})