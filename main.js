const dashboardState = {
    status: 'initial', // initial, checked-in, needs-attention
    checklist: [
        { task: 'Medication eaten?', completed: false },
        { task: 'Doctor Appointment?', completed: false },
        { task: 'Drink water?', completed: false },
    ]
};

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let speechRecognition = null;
let speechRecognitionCallback = null; // To store the callback for current recognition session

function initializeSpeechRecognition(callback) {
    if (SpeechRecognition) {
        if (!speechRecognition) { // Only create a new SpeechRecognition object if one doesn't exist
            speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = false; // We want to stop after a single command
            speechRecognition.interimResults = false;
        }

        speechRecognitionCallback = callback; // Store the provided callback

        speechRecognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim();
            speechRecognitionCallback(command);
            stopSpeechRecognition(); // Stop after a result
        };

        speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopSpeechRecognition(); // Stop on error
        };

        speechRecognition.onend = () => {
            console.log('Speech recognition service disconnected.');
            // No automatic restart here, button will handle starting.
        };
    } else {
        console.warn('Web Speech API not supported in this browser.');
    }
}

function startSpeechRecognition() {
    if (speechRecognition && speechRecognitionCallback) {
        speechRecognition.lang = currentLanguage; // Ensure correct language is set
        try {
            speechRecognition.start();
            console.log('Speech recognition started.');
            return true;
        } catch (e) {
            console.error('Error starting speech recognition:', e);
            return false;
        }
    }
    return false;
}

function stopSpeechRecognition() {
    if (speechRecognition) {
        speechRecognition.stop();
        console.log('Speech recognition stopped.');
    }
}

const translations = {
    en: {
        appTitle: "Guardian Angel by Ailoveyou",
        guardianAngel: "Guardian Angel",
        byAiloveyou: "by Ailoveyou",
        parentPortal: "Parent Portal",
        childDashboard: "Child Dashboard",
        loadingDashboard: "Loading dashboard...",
        imOkayToday: "I'm Okay Today",
        checkedIn: "Checked In!",
        iNeedHelp: "I Need Help",
        helpSignalSent: "Help Signal Sent",
        dailySelfCare: "Daily Self-Care",
        submitTasks: "Submit Tasks",
        submitted: "Submitted",
        addNewTask: "Add a new task...",
        add: "Add",
        whoToCall: "Who to call for help:",
        police: "Police:",
        ambulanceFire: "Ambulance / Fire:",
        activeAgeingCentre: "Active Ageing Centre:",
        findCentre: "Find a centre near you",
        aliveAndOkay: "Alive & Okay:",
        routine: "Routine:",
        dailyTasks: "Daily Tasks:",
        yes: "Yes",
        no: "No",
        noCheckIn: "No check-in yet today",
        normal: "Normal",
        exception: "Exception",
        needsAttention: "NEEDS ATTENTION",
        parentRequestedHelp: "Your parent has requested help.",
        voiceCommand: "Voice Command",
        listening: "Listening...",
        inspirationalQuotes: [
            { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
            { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
            { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
            { quote: "Self-education is, I firmly believe, the only kind of education there is.", author: "Isaac Asimov" }
        ],
        caringQuotes: [
            { quote: "To care for those who once cared for us is one of the highest honors.", author: "Tia Walker" },
            { quote: "Family is not an important thing. It's everything.", author: "Michael J. Fox" },
            { quote: "The closest thing to being cared for is to care for someone else.", author: "Carson McCullers" },
            { quote: "No matter your age, you will always need your mom.", author: "Unknown" }
        ]
    },
    zh: {
        appTitle: "守护天使 by Ailoveyou",
        guardianAngel: "守护天使",
        byAiloveyou: "by Ailoveyou",
        parentPortal: "家长门户",
        childDashboard: "孩子仪表板",
        loadingDashboard: "正在加载仪表板...",
        imOkayToday: "我今天很好",
        checkedIn: "已签到!",
        iNeedHelp: "我需要帮助",
        helpSignalSent: "已发送求助信号",
        dailySelfCare: "日常自我护理",
        submitTasks: "提交任务",
        submitted: "已提交",
        addNewTask: "添加新任务...",
        add: "添加",
        whoToCall: "谁可以求助:",
        police: "警察:",
        ambulanceFire: "救护车 / 消防:",
        activeAgeingCentre: "乐龄活动中心:",
        findCentre: "查找您附近的中心",
        aliveAndOkay: "安好:",
        routine: "日常:",
        dailyTasks: "日常任务:",
        yes: "是",
        no: "否",
        noCheckIn: "今天还没有签到",
        normal: "正常",
        exception: "例外",
        needsAttention: "需要注意",
        parentRequestedHelp: "您的家长请求帮助。",
        voiceCommand: "语音指令",
        listening: "正在聆听...",
        inspirationalQuotes: [
            { quote: "活得好像明天就会死去。学得好像你会永远活着。", author: "圣雄甘地" },
            { quote: "学习的美妙之处在于没有人可以把它从你身边带走。", author: "B.B. King" },
            { quote: "你读得越多，你知道的事情就越多。你学得越多，你能去的地方就越多。", author: "苏斯博士" },
            { quote: "我坚信，自我教育是唯一存在的教育。", author: "艾萨克·阿西莫夫" }
        ],
        caringQuotes: [
            { quote: "照顾那些曾经照顾过我们的人是最高的荣誉之一。", author: "Tia Walker" },
            { quote: "家庭不是一件重要的事情。它是一切。", author: "Michael J. Fox" },
            { quote: "最接近被照顾的感觉就是去照顾别人。", author: "Carson McCullers" },
            { quote: "无论你多大年纪，你永远需要你的妈妈。", author: "未知" }
        ]    },
    ms: {
        appTitle: "Malaikat Pelindung oleh Ailoveyou",
        guardianAngel: "Malaikat Pelindung",
        byAiloveyou: "oleh Ailoveyou",
        parentPortal: "Portal Ibu Bapa",
        childDashboard: "Papan Pemuka Anak",
        loadingDashboard: "Memuatkan papan pemuka...",
        imOkayToday: "Saya Baik Hari Ini",
        checkedIn: "Telah Daftar Masuk!",
        iNeedHelp: "Saya Perlukan Bantuan",
        helpSignalSent: "Isyarat Bantuan Dihantar",
        dailySelfCare: "Penjagaan Diri Harian",
        submitTasks: "Hantar Tugasan",
        submitted: "Telah Dihantar",
        addNewTask: "Tambah tugasan baru...",
        add: "Tambah",
        whoToCall: "Siapa yang perlu dihubungi untuk mendapatkan bantuan:",
        police: "Polis:",
        ambulanceFire: "Ambulans / Bomba:",
        activeAgeingCentre: "Pusat Penuaan Aktif:",
        findCentre: "Cari pusat berdekatan anda",
        aliveAndOkay: "Hidup & Baik:",
        routine: "Rutin:",
        dailyTasks: "Tugasan Harian:",
        yes: "Ya",
        no: "Tidak",
        noCheckIn: "Belum daftar masuk hari ini",
        normal: "Biasa",
        exception: "Pengecualian",
        needsAttention: "PERLUKAN PERHATIAN",
        parentRequestedHelp: "Ibu bapa anda telah meminta bantuan.",
        voiceCommand: "Perintah Suara",
        listening: "Mendengar...",
        inspirationalQuotes: [
            { quote: "Hiduplah seolah-olah anda akan mati esok. Belajarlah seolah-olah anda akan hidup selama-lamanya.", author: "Mahatma Gandhi" },
            { quote: "Perkara yang indah tentang belajar ialah tiada siapa yang boleh mengambilnya daripada anda.", author: "B.B. King" },
            { quote: "Semakin banyak anda membaca, semakin banyak perkara yang anda akan tahu. Semakin banyak anda belajar, semakin banyak tempat yang anda akan pergi.", author: "Dr. Seuss" },
            { quote: "Pendidikan kendiri adalah, saya amat percaya, satu-satunya jenis pendidikan yang ada.", author: "Isaac Asimov" }
        ],
        caringQuotes: [
            { quote: "Menjaga mereka yang pernah menjaga kita adalah salah satu penghormatan tertinggi.", author: "Tia Walker" },
            { quote: "Keluarga bukanlah perkara yang penting. Ia adalah segalanya.", author: "Michael J. Fox" },
            { quote: "Perkara yang paling hampir dengan dijaga adalah menjaga orang lain.", author: "Carson McCullers" },
            { quote: "Tidak kira umur anda, anda akan sentiasa memerlukan ibu anda.", author: "Tidak diketahui" }
        ]
    },
    ta: {
        appTitle: "பாதுகாவலர் தேவதை by Ailoveyou",
        guardianAngel: "பாதுகாவலர் தேவதை",
        byAiloveyou: "by Ailoveyou",
        parentPortal: "பெற்றோர் போர்டல்",
        childDashboard: "குழந்தை டாஷ்போர்டு",
        loadingDashboard: "டாஷ்போர்டு ஏற்றப்படுகிறது...",
        imOkayToday: "நான் இன்று நலமாக உள்ளேன்",
        checkedIn: "சரிபார்க்கப்பட்டது!",
        iNeedHelp: "எனக்கு உதவி தேவை",
        helpSignalSent: "உதவி சமிக்ஞை அனுப்பப்பட்டது",
        dailySelfCare: "தினசரி சுய பாதுகாப்பு",
        submitTasks: "பணிகளைச் சமர்ப்பி",
        submitted: "சமர்ப்பிக்கப்பட்டது",
        addNewTask: "புதிய பணியைச் சேர்...",
        add: "சேர்",
        whoToCall: "உதவிக்கு யாரை அழைப்பது:",
        police: "காவல்துறை:",
        ambulanceFire: "ஆம்புலன்ஸ் / தீயணைப்பு:",
        activeAgeingCentre: "செயலில் વૃદ્ધాపிய மையம்:",
        findCentre: "உங்களுக்கு அருகிலுள்ள மையத்தைக் கண்டறியவும்",
        aliveAndOkay: "உயிருடன் & நலமாக:",
        routine: "வழக்கம்:",
        dailyTasks: "தினசரி பணிகள்:",
        yes: "ஆம்",
        no: "இல்லை",
        noCheckIn: "இன்று இன்னும் செக்-இன் செய்யவில்லை",
        normal: "சாதாரணம்",
        exception: "விதிவிலக்கு",
        needsAttention: "கவனம் தேவை",
        parentRequestedHelp: "உங்கள் பெற்றோர் உதவி கோரியுள்ளனர்.",
        voiceCommand: "குரல் கட்டளை",
        listening: "கேட்கிறது...",
        inspirationalQuotes: [
            { quote: "நாளை இறந்துவிடுவீர்கள் என்பது போல் வாழுங்கள். என்றென்றும் வாழ்வீர்கள் என்பது போல் கற்றுக்கொள்ளுங்கள்.", author: "மகாத்மா காந்தி" },
            { quote: "கற்றலின் அழகான விஷயம் என்னவென்றால், அதை யாரும் உங்களிடமிருந்து பறிக்க முடியாது.", author: "பி.பி. கிங்" },
            { quote: "நீங்கள் எவ்வளவு அதிகமாகப் படிக்கிறீர்களோ, அவ்வளவு அதிகமாக விஷயங்களைத் தெரிந்துகொள்வீர்கள். நீங்கள் எவ்வளவு அதிகமாகக் கற்றுக்கொள்கிறீர்களோ, அவ்வளவு அதிகமான இடங்களுக்குச் செல்வீர்கள்.", author: "டாக்டர் சியூஸ்" },
            { quote: "சுய கல்வி மட்டுமே, நான் உறுதியாக நம்புகிறேன், இருக்கும் ஒரே கல்வி.", author: "ஐசக் அசிமோவ்" }
        ],
        caringQuotes: [
            { quote: "ஒரு காலத்தில் எங்களைப் பராமரித்தவர்களைப் பராமரிப்பது மிக உயர்ந்த கௌரவங்களில் ஒன்றாகும்.", author: "டியா வாக்கர்" },
            { quote: "குடும்பம் ஒரு முக்கியமான விஷயம் அல்ல. அதுவே எல்லாம்.", author: "மைக்கேல் ஜே. ஃபாக்ஸ்" },
            { quote: "பராமரிக்கப்படுவதற்கு மிக நெருக்கமான விஷயம் வேறொருவரைப் பராமரிப்பதாகும்.", author: "கார்சன் மெக்கல்லர்ஸ்" },
            { quote: "உங்கள் வயது எதுவாக இருந்தாலும், உங்களுக்கு எப்போதும் உங்கள் அம்மா தேவைப்படுவார்.", author: "தெரியவில்லை" }
        ]
    },
    hi: {
        appTitle: "गार्जियन एंजेल by Ailoveyou",
        guardianAngel: "गार्जियन एंजेल",
        byAiloveyou: "by Ailoveyou",
        parentPortal: "अभिभावक पोर्टल",
        childDashboard: "बच्चे का डैशबोर्ड",
        loadingDashboard: "डैशबोर्ड लोड हो रहा है...",
        imOkayToday: "मैं आज ठीक हूँ",
        checkedIn: "चेक इन किया!",
        iNeedHelp: "मुझे मदद की ज़रूरत है",
        helpSignalSent: "सहायता संकेत भेजा गया",
        dailySelfCare: "दैनिक स्व-देखभाल",
        submitTasks: "कार्य सबमिट करें",
        submitted: "सबमिट किया गया",
        addNewTask: "एक नया कार्य जोड़ें...",
        add: "जोड़ें",
        whoToCall: "मदद के लिए किसे बुलाएँ:",
        police: "पुलिस:",
        ambulanceFire: "एम्बुलेंस / फायर:",
        activeAgeingCentre: "सक्रिय वृद्धावस्था केंद्र:",
        findCentre: "अपने पास एक केंद्र खोजें",
        aliveAndOkay: "जीवित और ठीक:",
        routine: "नियमित:",
        dailyTasks: "दैनिक कार्य:",
        yes: "हाँ",
        no: "नहीं",
        noCheckIn: "आज अभी तक कोई चेक-इन नहीं हुआ है",
        normal: "सामान्य",
        exception: "अपवाद",
        needsAttention: "ध्यान देने की आवश्यकता है",
        parentRequestedHelp: "आपके माता-पिता ने मदद का अनुरोध किया है।",
        voiceCommand: "वॉयस कमांड",
        listening: "सुन रहा है...",
        inspirationalQuotes: [
            { quote: "ऐसे जियो जैसे कि तुम कल मरने वाले हो। ऐसे सीखो जैसे कि तुम हमेशा के लिए जीने वाले हो।", author: "महात्मा गांधी" },
            { quote: "सीखने के बारे में खूबसूरत बात यह है कि कोई भी इसे आपसे छीन नहीं सकता।", author: "बी.बी. किंग" },
            { quote: "जितना अधिक आप पढ़ेंगे, उतनी ही अधिक चीजें आप जानेंगे। जितना अधिक आप सीखेंगे, उतने ही अधिक स्थानों पर आप जाएंगे।", author: "डॉ. सीस" },
            { quote: "स्व-शिक्षा ही, मेरा दृढ़ विश्वास है, एकमात्र प्रकार की शिक्षा है।", author: "आइज़ैक असिमोव" }
        ],
        caringQuotes: [
            { quote: "जिन लोगों ने कभी हमारी परवाह की, उनकी परवाह करना सर्वोच्च सम्मानों में से एक है।", author: "टिया वॉकर" },
            { quote: "परिवार कोई महत्वपूर्ण चीज नहीं है। यह सब कुछ है।", author: "माइकल जे. फॉक्स" },
            { quote: "किसी की देखभाल करने के सबसे करीब की चीज किसी और की देखभाल करना है।", author: "कार्सन मैकुलर्स" },
            { quote: "आपकी उम्र चाहे जो भी हो, आपको हमेशा अपनी माँ की ज़रूरत होगी।", author: "अज्ञात" }
        ] 
    }
};

let currentLanguage = 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    const trans = translations[lang];
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });

    document.title = trans.appTitle;
    
    // Update Web Components
    document.querySelectorAll('daily-checkin, emergency-contacts, inspirational-quote, caring-quote').forEach(el => {
        el.setAttribute('lang', lang);
    });
    renderDashboard();

    // No automatic restart of speech recognition here, as it will be controlled by a button.
    // speechRecognition.lang will be set when startSpeechRecognition is called.
}

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
    
    const trans = translations[currentLanguage];
    let content = '';

    switch (dashboardState.status) {
        case 'needs-attention':
            content = `
                <p class="status-danger">${trans.needsAttention}</p>
                <p>${trans.parentRequestedHelp}</p>
                <emergency-contacts lang="${currentLanguage}"></emergency-contacts>
            `;
            break;
        case 'checked-in':
            content = `
                <p><strong>${trans.aliveAndOkay}</strong> <span class="status-yes">${trans.yes}</span></p>
                <p><strong>${trans.routine}</strong> ${trans.normal}</p>
                <hr>
                <h3>${trans.dailyTasks}</h3>
                <ul>
                    ${dashboardState.checklist.map(item => 
                        `<li><strong>${item.task}</strong> ${item.completed ? `&#9989; ${trans.yes}` : `&#10060; ${trans.no}`}</li>`
                    ).join('')}
                </ul>
            `;
            break;
        default: // initial state
            content = `
                <p><strong>${trans.aliveAndOkay}</strong> <span class="status-no">${trans.no}</span> (${trans.noCheckIn})</p>
                <p><strong>${trans.routine}</strong> ${trans.exception}</p>
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

    static get observedAttributes() {
        return ['lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'lang' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render(); // Initial render to set up the DOM
    }

    get lang() {
        return this.getAttribute('lang') || 'en';
    }

    get trans() {
        return translations[this.lang];
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
                #voice-command-btn {
                    background: var(--dark-grey);
                    box-shadow: 0 4px 15px rgba(160, 160, 160, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #voice-command-btn .icon {
                    font-size: 1.8rem;
                    margin-right: 10px;
                }
                #voice-command-btn.voice-active {
                    background: linear-gradient(135deg, #ff9a8b, #ff6a88);
                    box-shadow: 0 4px 15px rgba(255, 106, 136, 0.5);
                    animation: pulse-voice 1.5s infinite;
                }
                @keyframes pulse-voice {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            </style>
            <div class="button-grid">
                 <button id="checkin-btn">${this.trans.imOkayToday}</button>
                 <button id="escalation-btn">${this.trans.iNeedHelp}</button>
                 <button id="voice-command-btn" class="voice-inactive">
                    <span class="icon">🎙️</span> 
                    <span class="text">${this.trans.voiceCommand}</span>
                 </button>
            </div>

            <div id="checklist-container">
                <h3>${this.trans.dailySelfCare}</h3>
                <form id="checklist-form">
                    ${checklistHtml}
                    <button type="submit" id="submit-checklist-btn">${this.trans.submitTasks}</button>
                </form>
                <form id="add-task-form">
                    <input type="text" id="new-task-input" placeholder="${this.trans.addNewTask}" required>
                    <button type="submit" id="add-task-btn">${this.trans.add}</button>
                </form>
            </div>
            <emergency-contacts id="emergency-contacts" style="display: none;" lang="${this.lang}"></emergency-contacts>
        `;
        this.addEventListeners();
    }

    addEventListeners() {
        const checkinBtn = this.shadowRoot.querySelector('#checkin-btn');
        const escalationBtn = this.shadowRoot.querySelector('#escalation-btn');
        const checklistForm = this.shadowRoot.querySelector('#checklist-form');
        const addTaskForm = this.shadowRoot.querySelector('#add-task-form');
        const emergencyContacts = this.shadowRoot.querySelector('#emergency-contacts');
        const voiceCommandBtn = this.shadowRoot.querySelector('#voice-command-btn');

        let isVoiceRecognitionActive = false;

        // Initialize speech recognition with the callback to handle commands
        initializeSpeechRecognition((command) => {
            const lowerCaseCommand = command.toLowerCase();
            const imOkayTodayText = this.trans.imOkayToday.toLowerCase();
            const iNeedHelpText = this.trans.iNeedHelp.toLowerCase();

            if (lowerCaseCommand.includes(imOkayTodayText)) {
                if (checkinBtn && !checkinBtn.disabled) {
                    checkinBtn.click();
                    console.log('Voice command "I\'m Okay Today" activated.');
                }
            } else if (lowerCaseCommand.includes(iNeedHelpText)) {
                if (escalationBtn && !escalationBtn.disabled) {
                    escalationBtn.click();
                    console.log('Voice command "I Need Help" activated.');
                }
            }
            // Stop recognition after processing a command or if nothing was recognized
            stopSpeechRecognition();
            isVoiceRecognitionActive = false;
            voiceCommandBtn.classList.remove('voice-active');
            voiceCommandBtn.querySelector('.text').textContent = this.trans.voiceCommand;
        });

        voiceCommandBtn.addEventListener('click', () => {
            if (isVoiceRecognitionActive) {
                stopSpeechRecognition();
                isVoiceRecognitionActive = false;
                voiceCommandBtn.classList.remove('voice-active');
                voiceCommandBtn.querySelector('.text').textContent = this.trans.voiceCommand;
            } else {
                const started = startSpeechRecognition();
                if (started) {
                    isVoiceRecognitionActive = true;
                    voiceCommandBtn.classList.add('voice-active');
                    voiceCommandBtn.querySelector('.text').textContent = this.trans.listening;
                }
            }
        });

        checkinBtn.addEventListener('click', () => {
            dashboardState.status = 'checked-in';
            checkinBtn.textContent = this.trans.checkedIn;
            checkinBtn.disabled = true;
            escalationBtn.disabled = true;
            renderDashboard();
        });

        escalationBtn.addEventListener('click', () => {
            dashboardState.status = 'needs-attention';
            escalationBtn.textContent = this.trans.helpSignalSent;
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
            this.shadowRoot.querySelector('#submit-checklist-btn').textContent = this.trans.submitted;
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
    }

    static get observedAttributes() {
        return ['lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'lang' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback(){
        this.render();
    }

    get lang() {
        return this.getAttribute('lang') || 'en';
    }

    get trans() {
        return translations[this.lang];
    }

    render(){
        const randomQuote = this.trans.inspirationalQuotes[Math.floor(Math.random() * this.trans.inspirationalQuotes.length)];

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
    }

    static get observedAttributes() {
        return ['lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'lang' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback(){
        this.render();
    }

    get lang() {
        return this.getAttribute('lang') || 'en';
    }

    get trans() {
        return translations[this.lang];
    }

    render() {
        const randomQuote = this.trans.caringQuotes[Math.floor(Math.random() * this.trans.caringQuotes.length)];

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
    }

    static get observedAttributes() {
        return ['lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'lang' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback(){
        this.render();
    }

    get lang() {
        return this.getAttribute('lang') || 'en';
    }

    get trans() {
        return translations[this.lang];
    }

    render(){
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
                <h3>${this.trans.whoToCall}</h3>
                <ul>
                    <li>
                        <strong>${this.trans.police}</strong>
                        <a href="tel:999">999</a>
                    </li>
                    <li>
                        <strong>${this.trans.ambulanceFire}</strong>
                        <a href="tel:995">995</a>
                    </li>
                    <li>
                        <strong>${this.trans.activeAgeingCentre}</strong>
                        <a href="https://aic.sg/care-services/active-ageing-centres#who" target="_blank">
                            ${this.trans.findCentre}
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }
}
customElements.define('emergency-contacts', EmergencyContacts);

document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    languageSelector.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Initial render
    setLanguage('en');
});