document.addEventListener('DOMContentLoaded', () => {
    const studentListElement = document.getElementById('studentList');

    // Abrir o crear la base de datos
    const request = indexedDB.open('hpDatabase', 1);

    request.onupgradeneeded = (event) => {
        // Crear la tabla 'students' si no existe
        const db = event.target.result;
        const objectStore = db.createObjectStore('students', { keyPath: 'id' });

        // Crear un índice por nombre
        objectStore.createIndex('name', 'name', { unique: false });
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        // Verificar si ya hay datos en la base de datos
        const transaction = db.transaction('students', 'readonly');
        const objectStore = transaction.objectStore('students');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const storedData = event.target.result;

            if (storedData.length > 0) {
                // Si hay datos almacenados, mostrarlos
                displayStudents(storedData);
            } else {
                // Si no hay datos almacenados, obtener datos de la API
                fetch('https://hp-api.onrender.com/api/characters/students')
                    .then(response => response.json())
                    .then(data => {
                        // Almacenar datos en la base de datos
                        const transaction = db.transaction('students', 'readwrite');
                        const objectStore = transaction.objectStore('students');

                        data.slice(0, 20).forEach(student => {
                            objectStore.add(student);
                        });

                        // Mostrar los primeros 20 estudiantes en la lista
                        displayStudents(data.slice(0, 20));
                    })
                    .catch(error => console.error('Error fetching data:', error));
            }
        };
    };

    // Manejar errores al abrir la base de datos
    request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
    };
});

// Función para mostrar estudiantes en la lista
function displayStudents(students) {
    const studentListElement = document.getElementById('studentList');
    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = `${student.name} - House: ${student.house}`;
        studentListElement.appendChild(listItem);
    });
}