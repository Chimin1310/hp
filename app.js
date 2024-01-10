//obtenemos la url del servidor
var url=window.location.href;
//definimos que nuestro sw.js se encuentra en el repositorio
var ubicacionSw='/service-worker.js';

if ( navigator.serviceWorker ) {

    if(url.includes('localhost')){
        ubicacionSw='/service-worker.js';
    }
    navigator.serviceWorker.register(ubicacionSw);
}