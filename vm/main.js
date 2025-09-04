var ramSize = 1024;
var registerCount = 50;
var ram = new Uint8Array(ramSize);
var registers = new Uint8Array(registerCount);
var ramidx=0;

function start() {
  var running = true;
  var i=0;
  while (running) {
    switch(ram[i++]) {
      case 0x00: //NIL
        break;
      case 0x01: //STR
        var reg = ram[i++];
        var mem = ram[i++];
        registers[reg] = mem;
        break;
      case 0x02: //LOD
        var mem = ram[i++];
        var reg = ram[i++];
        ram[mem] = registers[reg];
        break;
      case 0x0F: //TST
        alert(Array.from(ram.slice(0, 16)));
        alert(Array.from(registers.slice(0, 16)));
        break;
      case 0xFF: //STP
        running = false;
        break;
    }
  }
}

function pushInstruction(code) {
  while (true) {
    if (ram[ramidx] == 0) {
      ram[ramidx] = code;
      ramidx++;
      break;
    }
  }
}
