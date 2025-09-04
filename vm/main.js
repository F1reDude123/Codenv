var ramSize = 1024;
var registerCount = 50;
var ram = new Uint8Array(ramSize);
var registers = new Uint8Array(registerCount);

function start() {
  var running = true;
  var i=0;
  while (running) {
    switch(ram[i++]) {
      case 0x00: //NIL
        break;
      case 0x01: //STR
        var reg = i++;
        var mem = i++;
        registers[reg] = ram[mem];
        break;
      case 0x02: //LOD
        var mem = i++;
        var reg = i++;
        ram[mem] = registers[reg];
        break;
      case 0x0F: //TST
        alert(ram.toString());
        alert(registers.toString());
        break;
      case 0xFF: //STP
        running = false;
        break;
    }
  }
}

function pushInstruction(code) {
  for (var i=0;i<ramSize;i++) {
    if (ram[i] == 0) {
      ram[i] = code;
      break;
    }
  }
}

function pushFile(file) {
  var reader = new FileReader();
  reader.onload = function() {reader.result.split(" ").forEach(e => { ram.set(e, 0) })};
  reader.readAsBinaryString(file);
}
