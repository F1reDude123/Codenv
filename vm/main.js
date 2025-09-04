var ramSize = 1024;
var registerCount = 50;
var ram = new Uint8Array(ramSize);
var registers = new Uint8Array(registerCount);

var running = true;
while (running) {
  var i=0;
  switch(ram[i++]) {
    case 0x00: //NIL
      break;
    case 0x01: //STR
      registers[++i] = ram[++i];
      break;
    case 0x02: //LOD
      ram[++i] = registers[++i];
      break;
    case 0x0f: //TST
      alert(ram);
      alert(registers);
      break;
    case 0xFF: //STP
      running = false;
      break;
  }
}

function pushInstruction(code) {
  ram.push(code);
}

function pushFile(file) {
  var reader = new FileReader();
  reader.onload = function() reader.result.split(" ").forEach(e => { ram.push(e) });
  reader.readAsBinaryString(file);
}
