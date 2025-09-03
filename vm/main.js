var ramSize = 1024;
var registerCount = 50;
var ram = new Uint8Array(ramSize);
var registers = new Uint8Array(registerCount);

var running = true;
while (running) {
  var i=0;
  switch(ram[i++]) {
    case 0x00:
      break;
    case 0x01:
      registers[++i] = ram[++i];
      break;
    case 0x02:
      ram[++i] = registers[++i];
      break;
    case 0x0f:
      alert(ram);
      alert(registers);
      break;
    case 0xFF:
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
