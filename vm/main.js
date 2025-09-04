class VM {
  ramSize = 1024;
  registerCount = 50;
  ram = new Uint8Array(ramSize);
  registers = new Uint8Array(registerCount);
  ramidx=0;
  constructor(){}
  
  start() {
    var i=0;
    var running = true;
    while (running) {
      switch(ram[i++]) {
        case 0x00: //NIL
          break;
        case 0x01: //STR
          var reg = this.ram[i++];
          var mem = this.ram[i++];
          this.registers[reg] = mem;
          break;
        case 0x02: //LOD
          var mem = this.ram[i++];
          var reg = this.ram[i++];
          this.ram[mem] = this.registers[reg];
          break;
        case 0x0F: //TST
          alert(Array.from(this.ram.slice(0, 16)));
          alert(Array.from(this.registers.slice(0, 16)));
          break;
        case 0xFF: //STP
          running = false;
          break;
      }
    }
  }
  
  pushInstruction(code) {
    while (true) {
      if (ram[ramidx] == 0) {
        ram[ramidx] = code;
        ramidx++;
        break;
      }
    }
  }
}
function pushFile(file) {
  var reader = new FileReader();
  reader.onload = function(){ram.set(reader.result.split(" "), 0)}
  reader.readAsBinaryString(file);
}
