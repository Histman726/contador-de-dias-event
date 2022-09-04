import "./main.css";

let events = [];
let arr = []; //Cargar los eventos

const eventName = document.querySelector("#EventName");
const eventDate = document.querySelector("#EventDate");
const buttonName = document.querySelector("#bAdd");
const eventsContainer = document.querySelector("#eventsContainer");

const json = load();
try {
  arr = JSON.parse(json);
} catch (e) {
  arr = [];
}
events = arr ? [...arr] : [];
renderEvents();

//Se espera en evento submit en el formulario del documento y se ejecutará una función
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addEvent();
});

//Una función para crear un evento nuevo que no necesita parámetros
function addEvent() {
  if (eventName.value === "" || eventDate.value === "") {
    return;
  }
  if (dateDiff(eventDate.value) <= 0) {
    return;
  }

  const newEvent = {
    id: (Math.random() * 100).toString(36).slice(3),
    name: eventName.value,
    date: eventDate.value,
  };
  events.unshift(newEvent);
  eventName.value = "";
  save(JSON.stringify(events));
  renderEvents();
}

/**
 * @param d {Date} es la fecha la cual sucederá el evento
 */
function dateDiff(d) {
  const targetDate = new Date(d),
    today = new Date();
  return Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
}

//función para renderizar los eventos creados
function renderEvents() {
  const eventHtml = events.map((event) => {
    return `
      <div class="event">
        <div class="days">
          <span class="days-number">${dateDiff(event.date)}</span>
          <span class="days-text">days</span>
        </div>
        <div class="event-name">
          ${event.name}
        </div>
        <div class="event-date">${event.date}</div>
        <div class="actions">
          <button class="bDelete" data-id="${event.id}">Eliminar</button>
        </div>
      </div>
    `;
  });
  eventsContainer.innerHTML = eventHtml.join("");
  //Se seleccionan todos los botones con la clase bDelete y se escucha su evento clic, posteriormente se elimina el elemento deseado
  document.querySelectorAll(".bDelete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = button.getAttribute("data-id");
      events = events.filter((event) => event.id !== id);
      save(JSON.stringify(events));
      renderEvents();
    });
  });
}

/**
 *@param data {string} es el conjunto de eventos creados en formato json que se guardaran en el localStorage
 */

function save(data) {
  localStorage.setItem("events", data);
}

//función que mostrara los valores guardados en el localStorage
function load() {
  return localStorage.getItem("events");
}
