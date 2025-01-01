const task = document.querySelector('#taskBtn');
const note= document.querySelector('#noteArea');
const tasks = document.querySelector('#taskList');
getTime();

function getTime(){
    const date = new Date();
    const presentTime = date.toLocaleTimeString();
    document.querySelector('#time').innerText = `${presentTime}`;
}



let i =0;
task.addEventListener('click', () => {
    if (i <8){
        getTime();
        if (note.value !==" "){
            const newTask = document.createElement('li');
            newTask.innerText = note.value;
            const deleteBtn = document.createElement('Button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.classList.add('delete-btn', 'm-2', 'p-1', 'bg-red-500', 'text-white', 'rounded-lg', 'hover:bg-red-700');
            newTask.appendChild(deleteBtn);
            const editBtn = document.createElement('Button');
            editBtn.innerText = 'Edit';
            editBtn.classList.add('edit-btn', 'm-2' ,'p-1', 'bg-red-500', 'text-white', 'rounded-lg', 'hover:bg-red-700');
            newTask.appendChild(editBtn);
            newTask.classList.add('overflow-clip', 'hover:border-2', 'border-amber-200', 'rounded-xl', 'p-4', 'hover:bg-blue-300', 'h-auto');
            tasks.appendChild(newTask);
            i++;
            note.value = ' ';

            deleteBtn.addEventListener('click', () =>{
                getTime();
                newTask.remove();
            });

            editBtn.addEventListener('click', () => {
                // Replace the task text with an input field for editing
                const currentText = newTask.firstChild.nodeValue; // Get the current task text
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText; // Set the current text as the input value
                editInput.classList.add('edit-input', 'p-2', 'rounded-xl', 'bg-gray-100');

                // Replace task text with input field
                newTask.firstChild.replaceWith(editInput);

                // Change the edit button text to 'Save'
                editBtn.innerText = 'Save';

                // Handle save functionality
                editBtn.addEventListener('click', () => {
                    const updatedText = editInput.value.trim();
                    if (updatedText !== '') {
                        // Update the task text with the new value from the input field
                        newTask.firstChild.replaceWith(document.createTextNode(updatedText)); // Update task text
                        editBtn.innerText = 'Edit'; // Change button text back to 'Edit'
                    }
                });
            });
        }
        else{
            note.value = "Sorry, You cannot add empty task";
            setTimeout(() =>{
                note.value = '';
            },2000);
        }
    }
    else{
        note.value = "Sorry, You can only add 8 note! Delete Some Old Notes";
        setTimeout(() =>{
            note.value = '';
        },4000);
    }

});


