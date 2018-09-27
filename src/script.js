document.addEventListener('keydown', pressNotes);

document.addEventListener('keyup', releaseNotes);

export const noteValues = [
    {
      name: 'quarter',
      keycode: 81,
      pressed: false
    },
    {
      name: 'eighth',
      keycode: 69,
      pressed: false
    },
    {
      name: 'half',
      keycode: 72,
      pressed: false
    },
    {
      name: 'whole',
      keycode: 87,
      pressed: false
    },
    {
      name: 'sixteenth',
      keycode: 83,
      pressed: false
    },
    {
      name: 'augmentationDot',
      keycode: 190,
      pressed: false
    }
];

export let writtenNotes = [];
export let sixteenthNoteCount = 0;

export function pressNotes(e) {

  let note = document.getElementById('note').textContent;
  const suitableKeyCodes = [81, 69, 72, 87, 83, 190, 68];

  //delete handling for notes
  if (e.keyCode === 68 && writtenNotes.length >= 1) {

    console.log(sixteenthNoteCount);

    let length = writtenNotes.length;

    console.log('the last array item is ', writtenNotes[length - 1])

    //if last entry was a barline
    if (writtenNotes[length - 1] === '|') {
      sixteenthNoteCount = 16;
      console.log(sixteenthNoteCount);
    }

    //if last entry was a sixteenth note
    else if (writtenNotes[length - 1].includes('/4')) {
      sixteenthNoteCount -= 1;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a eighth note
    else if (writtenNotes[length - 1].includes('/2')) {
      sixteenthNoteCount -= 2;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a dotted eighth note
    else if (writtenNotes[length - 1].includes('3//')) {
      sixteenthNoteCount -= 3;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a dotted quarter note
    else if (writtenNotes[length - 1].includes('3/')) {
      sixteenthNoteCount -= 6;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a quarter note
    else if (writtenNotes[length - 1].length === 1) {
      sixteenthNoteCount -= 4;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a half note
    else if (writtenNotes[length - 1].includes('2')) {
      sixteenthNoteCount -= 8;
      console.log(sixteenthNoteCount);
    }
    //if last entry was a dotted half note
    else if (writtenNotes[length - 1].includes('3') && !writtenNotes[length - 1].includes('/')) {
      sixteenthNoteCount -= 12;
      console.log(sixteenthNoteCount);
    }

    //if last entry was a whole note
    else if (writtenNotes[length - 1].includes('4')) {
      sixteenthNoteCount -= 16;
      console.log(sixteenthNoteCount);
    }
    // console.log(sixteenthNoteCount);
    writtenNotes.pop();
    writeABCNotation('');
  }

  else if (suitableKeyCodes.includes(e.keyCode) && note !== '--' && note !== '-') {

    const pressedNote = noteValues.find(foundNote => foundNote.keycode === e.keyCode);

    if (pressedNote.name === 'augmentationDot') {
      pressedNote.pressed = true;
      return;
    }

    //dotted notes
    if (noteValues[5].pressed === true && e.keyCode !== noteValues[5].keycode) {
      document.getElementById('notesDiv').append(`${note} dotted ${pressedNote.name}  `);

      //dotted whole 
      if (pressedNote.keycode === 87) {
        assignABCNotation(`${note}5`);
      }
      //dotted half
      if (pressedNote.keycode === 72) {
        assignABCNotation(`${note}3`);
      }
      //dotted quarter
      else if (pressedNote.keycode === 81) {
        assignABCNotation(`${note}3/`);
      }
      //dotted eighth
      else if (pressedNote.keycode === 69) {
        assignABCNotation(`${note}3//`);
      }
    }

    //whole note 
    else if (pressedNote.keycode === 87) {
      assignABCNotation(`${note}4`);
    }

    //half note
    else if (pressedNote.keycode === 72) {
      document.getElementById('notesDiv').append(`${note} half`);
      assignABCNotation(`${note}2`);
    }

    //quarter note
    else if (pressedNote.keycode === 81) {
      document.getElementById('notesDiv').append(`${note}`);
      assignABCNotation(note);
    }

    //eighth note
    else if (pressedNote.keycode === 69) {
      document.getElementById('notesDiv').append(`${note}`);
      assignABCNotation(`${note}/2`);
    }

    //sixteenth note
    else if (pressedNote.keycode === 83) {
      document.getElementById('notesDiv').append(`${note}`);
      assignABCNotation(`${note}/4`);
    }
  } 
}

export function releaseNotes(e) {
  noteValues[5].pressed = false;
}


export function assignABCNotation(oldNote) {

  let hz = document.getElementById('pitch').textContent;
  
  let intHz = parseInt(hz, 10);
  
  let newNote;

  function insert(str, index, value) {
      return str.substr(0, index) + value + str.substr(index);
  }

  if (oldNote[1] !== '#') {
    //high pitches
    if (intHz > 2050) {
      newNote = oldNote.toLowerCase();
    }
    //low pitches
    else if (intHz < 1025) {
      //commas are used to designate lower octave
      let lowNote = insert(oldNote, 1, ',');
      newNote = `${lowNote}`;
    }
    //mid-range pitches
    else {
      newNote = oldNote;
    }
  }

  else if (oldNote[1] === '#') {

    let regexOfHash = /#/;
    let noHashNote = oldNote.replace(regexOfHash, '');

    //high pitches
    if (intHz > 2050) {
      newNote = `^${noHashNote.toLowerCase()}`;
    }
    //low pitches
    else if (intHz < 1025) {
      //commas are used to designate lower octave
      let lowNote = insert(noHashNote, 1, ',');
      newNote = `^${lowNote}`;
    }
    //mid-range pitches
    else {
      newNote = `^${noHashNote}`;
    } 
  }

  writeABCNotation(newNote);
  
}

export function writeABCNotation(notable) {

  console.log(notable);

  let notesToDisplay;
  
  if (notable === undefined) {
    return;
  }

  //if deleted note
  else if (notable === '') {
    notesToDisplay = writtenNotes.join('');
  }

  //if whole note 
  else if (notable.includes('4') && !notable.includes('/')) {
    if (sixteenthNoteCount !== 0 && sixteenthNoteCount !== 16) {
      return;
    }

    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 16;
  }

  //if dotted half
  else if (notable.includes('3') && !notable.includes('/')) {
    if (sixteenthNoteCount > 4 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 12; 
  }

  //if half note
  else if (notable.includes('2') && !notable.includes('/')) {
    if (sixteenthNoteCount > 8 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 8;
  }

  //if dotted quarter
  else if (notable.includes('3/') && !notable.includes('//')) {
    if (sixteenthNoteCount > 10 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 6; 
  }

  //if dotted eigth
  else if (notable.includes('3//')) {
    if (sixteenthNoteCount > 13 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 3;
  }

  //if eighth note
  else if (notable.includes('/2')) {
    if (sixteenthNoteCount > 14 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 2;
  }

  //if sixteenth note
  else if (notable.includes('/4')) {
    if (sixteenthNoteCount > 15 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 1;
  }

  //if quarter note
  else {
    if (sixteenthNoteCount > 12 && sixteenthNoteCount < 16) { 
      return;
    }
    else if (sixteenthNoteCount === 16) {
      writtenNotes.push('|');
      sixteenthNoteCount = 0;
    }
    writtenNotes.push(notable);
    notesToDisplay = writtenNotes.join('');
    sixteenthNoteCount += 4;
  }
      
  let music = 
  "T: Composition\n" +
  "M: 4/4\n" +
  "L: 2/8\n" +
  "K: Cmaj\n" +
  `|${notesToDisplay}`;
  
  ABCJS.renderAbc("paper", music);
  
}



