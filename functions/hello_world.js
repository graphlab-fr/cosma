window.addEventListener('DOMContentLoaded', () => {

    console.log('Hello world');

    document.getElementById('version').textContent = process.env.version;

});