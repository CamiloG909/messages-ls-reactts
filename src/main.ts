import './css/styles.css'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { v4 } from 'uuid'

interface Message {
	id: string;
	message: string;
}

let messages : Message[] = [];

const containerMessages = document.querySelector<HTMLDivElement>('#container-messages');
const form = document.querySelector<HTMLFormElement>('#new-message');

document.addEventListener('DOMContentLoaded', () => {
	const messagesLoaded : Message[] = localStorageFx('messages');
	messages = messagesLoaded;
	renderMessages();
});

form?.addEventListener('submit', (e) => {
	e.preventDefault();

	const message : string = form['new-message'].value;

	if(message === '') {
		return showNotification('Please, write a message', 'error');
	}

	messages.push({id: v4(), message});

	localStorageFx('messages', 'SET',  messages);
	renderMessages();
	showNotification('Message saved');

	form.reset();
	form['new-message'].focus();
});

function showNotification(text: string, type : 'success' | 'error' = 'success') {
	return Toastify({
		text,
		duration: 1500,
		close: true,
		gravity: "bottom",
		position: "right",
		stopOnFocus: true,
		style: {
			fontSize: '1.5rem',
			background: type === 'success' ? "linear-gradient(to right, #1ccc5b, #117F38)" : "#e81111",
			borderRadius: '10px',
			userSelect: 'none'
		},
		onClick: function(){
			if(type === 'error' && form) form['new-message'].focus();
		}
	}).showToast();
}

function renderMessages() {
	if(containerMessages) {
		containerMessages.innerHTML = '<p class="my-messages__title">My messages</p>';
	}

  messages.forEach((message) => {
    const btn = document.createElement("i");
    btn.className = "bi bi-x-circle-fill card-message__icon";
    btn.title = "Delete message";
		btn.onclick = () => {
			messages = messages.filter((m) => m.id !== message.id);
			localStorageFx('messages', 'SET', messages);
			renderMessages();
		}

    const card = document.createElement("article");
    card.className = "card-message";
    card.innerHTML = `${message.message}`;

    card.appendChild(btn);

    if (containerMessages?.classList.contains("lock")) {
      containerMessages?.classList.remove("lock");
    }

    containerMessages?.appendChild(card);
  });
}

function localStorageFx(key : string, method : 'GET' | 'SET' = 'GET', value? : Message[]) {
	if (method === 'GET') {
		const response = window.localStorage.getItem(key);
		return response ? JSON.parse(response) : [];
	} else if (method === 'SET') {
		window.localStorage.setItem(key, JSON.stringify(value));
		return value;
	}
}
