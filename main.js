const dashboardState = {
    status: 'initial', // initial, checked-in, needs-attention
    checklist: [
        { task: 'Medication eaten?', completed: false },
        { task: 'Doctor Appointment?', completed: false },
        { task: 'Drink water?', completed: false },
    ]
};

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function renderDashboard() {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;

    let content = '';

    switch (dashboardState.status) {
        case 'needs-attention':
            content = `
                <p class="status-danger">NEEDS ATTENTION</p>
                <p>Your parent has requested help.</p>
                <emergency-contacts></emergency-contacts>
            `;
            break;
        case 'checked-in':
            content = `
                <p><strong>Alive & Okay:</strong> <span class="status-yes">Yes</span></p>
                <p><strong>Routine:</strong> Normal</p>
                <hr>
                <h3>Daily Tasks</h3>
                <ul>
                    ${dashboardState.checklist.map(item => 
                        `<li><strong>${item.task}</strong> ${item.completed ? '&#9989; Yes' : '&#10060; No'}</li>`
                    ).join('')}
                </ul>
            `;
            break;
        default: // initial state
            content = `
                <p><strong>Alive & Okay:</strong> <span class="status-no">No</span> (No check-in yet today)</p>
                <p><strong>Routine:</strong> Exception</p>
            `;
    }
    dashboard.innerHTML = content;
}

class DailyCheckin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render = debounce(this.render.bind(this), 50);
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const checklistHtml = dashboardState.checklist.map((item, index) => `
            <label for="task-${index}" class="checklist-item">
                <input type="checkbox" id="task-${index}" data-index="${index}" ${item.completed ? 'checked' : ''}>
                <span>${item.task}</span>
                <button class="delete-btn" data-index="${index}">&times;</button>
            </label>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .button-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
                button {
                    width: 100%;
                    padding: 20px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                #checkin-btn {
                    background: linear-gradient(135deg, var(--primary-color, #4a90e2), var(--secondary-color, #50e3c2));
                    box-shadow: 0 4px 15px var(--glow-color, rgba(74, 144, 226, 0.5));
                }
                #escalation-btn {
                    background-color: var(--danger-color, #e74c3c);
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.5);
                }
                #submit-checklist-btn {
                    background-color: var(--primary-color, #4a90e2);
                    margin-top: 1rem; 
                }
                button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }
                h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                    color: var(--text-color, #333);
                }
                .checklist-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 1.1rem;
                }
                .checklist-item input[type="checkbox"] {
                    width: 20px; 
                    height: 20px;
                    margin-right: 15px;
                }
                .checklist-item span {
                    flex-grow: 1;
                }
                .delete-btn {
                    background: var(--danger-color, #e74c3c);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    font-size: 1rem;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    padding: 0;
                }
                #add-task-form {
                    display: flex;
                    margin-top: 20px;
                }
                #new-task-input {
                    flex-grow: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                #add-task-btn {
                    background: var(--primary-color, #4a90e2);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 10px 15px;
                    margin-left: 10px;
                    cursor: pointer;
                }
            </style>
            <div class="button-grid">
                 <button id="checkin-btn">I'm Okay Today</button>
                 <button id="escalation-btn">I Need Help</button>
            </div>

            <div id="checklist-container">
                <h3>Daily Self-Care</h3>
                <form id="checklist-form">
                    ${checklistHtml}
                    <button type="submit" id="submit-checklist-btn">Submit Tasks</button>
                </form>
                <form id="add-task-form">
                    <input type="text" id="new-task-input" placeholder="Add a new task..." required>
                    <button type="submit" id="add-task-btn">Add</button>
                </form>
            </div>
            <emergency-contacts id="emergency-contacts" style="display: none;"></emergency-contacts>
        `;
        this.addEventListeners();
    }

    addEventListeners() {
        const checkinBtn = this.shadowRoot.querySelector('#checkin-btn');
        const escalationBtn = this.shadowRoot.querySelector('#escalation-btn');
        const checklistForm = this.shadowRoot.querySelector('#checklist-form');
        const addTaskForm = this.shadowRoot.querySelector('#add-task-form');
        const emergencyContacts = this.shadowRoot.querySelector('#emergency-contacts');

        checkinBtn.addEventListener('click', () => {
            dashboardState.status = 'checked-in';
            checkinBtn.textContent = 'Checked In!';
            checkinBtn.disabled = true;
            escalationBtn.disabled = true;
            renderDashboard();
        });

        escalationBtn.addEventListener('click', () => {
            dashboardState.status = 'needs-attention';
            escalationBtn.textContent = 'Help Signal Sent';
            checkinBtn.disabled = true;
            escalationBtn.disabled = true;
            this.shadowRoot.querySelector('#submit-checklist-btn').disabled = true;
            emergencyContacts.style.display = 'block';
            renderDashboard();
        });

        checklistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                dashboardState.checklist[index].completed = checkbox.checked;
            });
            this.shadowRoot.querySelector('#submit-checklist-btn').textContent = 'Submitted';
            this.shadowRoot.querySelector('#submit-checklist-btn').disabled = true;
            checkboxes.forEach(cb => cb.disabled = true);
            
            if (dashboardState.status === 'checked-in') {
                renderDashboard();
            }
        });

        // Handle delete clicks
        checklistForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.dataset.index, 10);
                this.deleteTask(index);
            }
        });
        
        // Handle checkbox changes
        checklistForm.addEventListener('change', (e) => {
            if(e.target.type === 'checkbox'){
                const index = parseInt(e.target.dataset.index, 10);
                dashboardState.checklist[index].completed = e.target.checked;
                if (dashboardState.status === 'checked-in') {
                    renderDashboard();
                }
            }
        });

        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTaskInput = this.shadowRoot.querySelector('#new-task-input');
            const taskText = newTaskInput.value.trim();
            if (taskText) {
                this.addTask(taskText);
                newTaskInput.value = '';
            }
        });
    }

    addTask(task) {
        dashboardState.checklist.push({ task, completed: false });
        this.render();
        renderDashboard();
    }

    deleteTask(index) {
        dashboardState.checklist.splice(index, 1);
        this.render();
        renderDashboard();
    }
}

customElements.define('daily-checkin', DailyCheckin);

class InspirationalQuote extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const quotes = [
            {
                quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
                author: "Mahatma Gandhi"
            },
            {
                quote: "The beautiful thing about learning is that nobody can take it away from you.",
                author: "B.B. King"
            },
            {
                quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
                author: "Dr. Seuss"
            },
            {
                quote: "Self-education is, I firmly believe, the only kind of education there is.",
                author: "Isaac Asimov"
            }
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        this.shadowRoot.innerHTML = `
            <style>
                blockquote {
                    font-style: italic;
                    margin: 20px 0;
                    padding: 10px 20px;
                    border-left: 5px solid var(--primary-color);
                    background-color: var(--light-grey);
                }
                figcaption {
                    text-align: right;
                    font-weight: bold;
                }
            </style>
            <blockquote>
                <p>"${randomQuote.quote}"</p>
                <figcaption>â ${randomQuote.author}</figcaption>
            </blockquote>
        `;
    }
}

customElements.define('inspirational-quote', InspirationalQuote);

class CaringQuote extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const quotes = [
            {
                quote: "To care for those who once cared for us is one of the highest honors.",
                author: "Tia Walker"
            },
            {
                quote: "Family is not an important thing. It's everything.",
                author: "Michael J. Fox"
            },
            {
                quote: "The closest thing to being cared for is to care for someone else.",
                author: "Carson McCullers"
            },
            {
                quote: "No matter your age, you will always need your mom.",
                author: "Unknown"
            }
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        this.shadowRoot.innerHTML = `
            <style>
                blockquote {
                    font-style: italic;
                    margin: 20px 0;
                    padding: 10px 20px;
                    border-left: 5px solid var(--secondary-color);
                    background-color: var(--light-grey);
                }
                figcaption {
                    text-align: right;
                    font-weight: bold;
                }
            </style>
            <blockquote>
                <p>"${randomQuote.quote}"</p>
                <figcaption>â ${randomQuote.author}</figcaption>
            </blockquote>
        `;
    }
}

customElements.define('caring-quote', CaringQuote);

class EmergencyContacts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .contacts {
                    margin-top: 20px;
                    border: 2px solid var(--danger-color, #e74c3c);
                    border-radius: 10px;
                    padding: 20px;
                }
                h3 {
                    font-size: 1.2rem;
                    color: var(--danger-color, #e74c3c);
                    margin-top: 0;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                li {
                    margin-bottom: 10px;
                }
                a {
                    text-decoration: none;
                    color: var(--primary-color, #4a90e2);
                    font-weight: bold;
                }
            </style>
            <div class="contacts">
                <h3>Who to call for help:</h3>
                <ul>
                    <li>
                        <strong>Police:</strong>
                        <a href="tel:999">999</a>
                    </li>
                    <li>
                        <strong>Ambulance / Fire:</strong>
                        <a href="tel:995">995</a>
                    </li>
                    <li>
                        <strong>Active Ageing Centre:</strong>
                        <a href="https://aic.sg/care-services/active-ageing-centres#who" target="_blank">
                            Find a centre near you
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }
}
customElements.define('emergency-contacts', EmergencyContacts);

document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderDashboard();
});
