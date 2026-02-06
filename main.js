const dashboardState = {
    status: 'initial', // initial, checked-in, needs-attention
    checklist: [
        { task: 'Medication eaten?', completed: false },
        { task: 'Doctor Appointment?', completed: false },
        { task: 'Drink water?', completed: false },
    ]
};

function renderDashboard() {
    const dashboard = document.getElementById('dashboard-content');
    let content = '';

    switch (dashboardState.status) {
        case 'needs-attention':
            content = `
                <p class="status-danger">NEEDS ATTENTION</p>
                <p>Your parent has requested help.</p>
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

        const template = document.createElement('template');
        template.innerHTML = `
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
                 .checklist-item input {
                    width: 20px; 
                    height: 20px;
                    margin-right: 15px;
                }

            </style>
            <div class="button-grid">
                 <button id="checkin-btn">I'm Okay Today</button>
                 <button id="escalation-btn">I Need Help</button>
            </div>

            <form id="checklist-form">
                <h3>Daily Self-Care</h3>
                ${dashboardState.checklist.map((item, index) => `
                    <label for="task-${index}" class="checklist-item">
                        <input type="checkbox" id="task-${index}" name="${item.task}">
                        <span>${item.task}</span>
                    </label>
                `).join('')}
                <button type="submit" id="submit-checklist-btn">Submit Tasks</button>
            </form>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const checkinBtn = this.shadowRoot.querySelector('#checkin-btn');
        const escalationBtn = this.shadowRoot.querySelector('#escalation-btn');
        const checklistForm = this.shadowRoot.querySelector('#checklist-form');
        const submitBtn = this.shadowRoot.querySelector('#submit-checklist-btn');

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
            submitBtn.disabled = true;
            renderDashboard();
        });

        checklistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                dashboardState.checklist[index].completed = checkbox.checked;
            });
            submitBtn.textContent = 'Submitted';
            submitBtn.disabled = true;
            checkboxes.forEach(cb => cb.disabled = true);
            
            if (dashboardState.status === 'checked-in') {
                renderDashboard();
            }
        });
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


document.addEventListener('DOMContentLoaded', renderDashboard);
