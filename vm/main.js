class VM {
  constructor(ramSize = 1024, registerCount = 50){this.ramSize=ramSize;this.registerCount=registerCount}
  ramSize = 1024;
  registerCount = 50;
  ram = new Uint8Array(this.ramSize);
  registers = new Uint8Array(this.registerCount);
  ramidx=0;
  
  start() {
    var i=0;
    var running = true;
    while (running) {
      switch(this.ram[i++]) {
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
    this.ram[this.ramidx] = code;
    this.ramidx++;
  }
  pushBinary(bin) {
    this.ram.set(bin, 0);
  }
}
