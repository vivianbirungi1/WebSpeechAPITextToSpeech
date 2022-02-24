// init SpeechSynth API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// init voices array
let voices = [];

const getVoices = () => {
    // all voices in list are coming from synth.getVoices
    voices = synth.getVoices();
    //console.log(voices);

    //loop through voices and create an option for each one
    voices.forEach(voice => {
        //create option element
        const option = document.createElement('option');
        //fill option with voice and language
        option.textContent = voice.name + '('+ voice.lang +')';

        //set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);

    });
};

// event is not supported in firefox so have to call getVoices
getVoices(); 
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
    //check if speaking
    if(synth.speaking) {
        console.error('Already speaking...');
        return;

    }
    if(textInput.value !== '') {
         //add background animation
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';


        //get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        //speak end
        speakText.onend = e => {
            console.log('Done speaking...');
            //to remove gif after voice is done speaking. background gets set back to the colour
            body.style.background = '#141414';
        }

        //speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        //selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        //if current voice/iteration matches then choose that voice
        //loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;

            }
        });

        //set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak
        synth.speak(speakText);
    }
};

//set event listeners

// text form submission
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

//rate value change 
rate.addEventListener('change', e => rateValue.textContent = rate.value)

//pitch value change 
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)


//voice select change
voiceSelect.addEventListener('change', e => speak());