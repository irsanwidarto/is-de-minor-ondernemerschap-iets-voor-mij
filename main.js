import './style.css'
import { questions } from './questions.js'

const app = document.querySelector('#app')

let currentStep = 0
// Steps: 0, 1, 2 (Questions), 3 (Email), 4 (End/No Match)

function render() {
    app.innerHTML = ''

    if (currentStep < questions.length) {
        renderQuestion(questions[currentStep])
    } else if (currentStep === 3) {
        renderEmailForm()
    } else if (currentStep === 4) {
        renderEndScreen()
    } else {
        renderSuccessScreen()
    }
}

function renderQuestion(question) {
    const container = document.createElement('div')
    container.className = 'card fade-in'

    const title = document.createElement('h1')
    title.textContent = question.text

    const buttonGroup = document.createElement('div')
    buttonGroup.className = 'button-group'

    const yesBtn = document.createElement('button')
    yesBtn.className = 'btn btn-primary'
    yesBtn.textContent = 'Ja'
    yesBtn.onclick = () => {
        currentStep = 3 // Go to Email
        render()
    }

    const noBtn = document.createElement('button')
    noBtn.className = 'btn btn-secondary'
    noBtn.textContent = 'Nee'
    noBtn.onclick = () => {
        if (currentStep < questions.length - 1) {
            currentStep++
        } else {
            currentStep = 4 // End screen
        }
        render()
    }

    buttonGroup.appendChild(yesBtn)
    buttonGroup.appendChild(noBtn)

    container.appendChild(title)
    container.appendChild(buttonGroup)
    app.appendChild(container)
}

// Helper function for Netlify form submission
const encode = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

function renderEmailForm() {
    const container = document.createElement('div')
    container.className = 'card fade-in'

    const title = document.createElement('h2')
    title.textContent = "Geweldig! Laten we contact houden."
    title.style.marginBottom = '1rem'

    const text = document.createElement('p')
    text.textContent = "Laat je email achter voor meer informatie over de minor."

    const form = document.createElement('form')
    // Netlify attributes for the dynamic form
    form.setAttribute('name', 'email-capture')
    form.setAttribute('method', 'POST')
    form.setAttribute('data-netlify', 'true')

    form.onsubmit = async (e) => {
        e.preventDefault()
        const submitBtn = form.querySelector('button')
        const originalText = submitBtn.textContent
        submitBtn.disabled = true
        submitBtn.textContent = 'Versturen...'

        try {
            // Check if we are on localhost
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Localhost detected: Mocking Netlify form submission');
                console.log('Form data:', { "form-name": "email-capture", "email": input.value });
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Mock success
                currentStep = 5; // Success screen
                render();
                return;
            }

            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({
                    "form-name": "email-capture",
                    "email": input.value
                })
            });

            if (response.ok) {
                currentStep = 5 // Success screen
                render()
            } else {
                throw new Error('Submission failed')
            }
        } catch (error) {
            console.error(error)
            alert('Er ging iets mis. Probeer het later opnieuw.')
            submitBtn.disabled = false
            submitBtn.textContent = originalText
        }
    }

    const input = document.createElement('input')
    input.type = 'email'
    input.name = 'email'
    input.placeholder = 'jouw@email.com'
    input.required = true
    input.className = 'input-field'

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.className = 'btn btn-primary'
    submitBtn.textContent = 'Verstuur'
    submitBtn.style.marginTop = '1rem'

    form.appendChild(input)
    form.appendChild(submitBtn)

    container.appendChild(title)
    container.appendChild(text)
    container.appendChild(form)
    app.appendChild(container)
}

function renderEndScreen() {
    const container = document.createElement('div')
    container.className = 'card fade-in'

    const title = document.createElement('h2')
    title.textContent = "Misschien volgend jaar?"

    const text = document.createElement('p')
    text.textContent = "Het lijkt erop dat de minor nu niet perfect past, maar kijk gerust rond op onze website."

    const link = document.createElement('a')
    link.href = "#"
    link.textContent = "Terug naar begin"
    link.className = 'link'
    link.onclick = (e) => {
        e.preventDefault()
        currentStep = 0
        render()
    }

    container.appendChild(title)
    container.appendChild(text)
    container.appendChild(link)
    app.appendChild(container)
}

function renderSuccessScreen() {
    const container = document.createElement('div')
    container.className = 'card fade-in'

    const title = document.createElement('h2')
    title.textContent = "Bedankt voor je interesse!"

    const text = document.createElement('p')
    text.textContent = "We hebben je gegevens ontvangen en nemen snel contact met je op."

    const link = document.createElement('a')
    link.href = "#"
    link.textContent = "Terug naar begin"
    link.className = 'link'
    link.onclick = (e) => {
        e.preventDefault()
        currentStep = 0
        render()
    }

    container.appendChild(title)
    container.appendChild(text)
    container.appendChild(link)
    app.appendChild(container)
}

render()
