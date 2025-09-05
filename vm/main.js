class VM {
  ramSize;
  registerCount;
  constructor(ramSize = 1024, registerCount = 50) {
    this.ram = new Uint8Array(ramSize);
    this.registers = new Uint8Array(registerCount);
  }
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
        case 0x03: //ADD
          var add1 = this.ram[i++];
          var add2 = this.ram[i++];
          this.registers[add1] = this.registers[add1]+this.registers[add2];
          break;
        case 0x04: //SUB
          var sub1 = this.ram[i++];
          var sub2 = this.ram[i++];
          this.registers[sub1] = this.registers[sub1]-this.registers[sub2];
          break;
        case 0x05: //MUL
          var mul1 = this.ram[i++];
          var mul2 = this.ram[i++];
          this.registers[mul1] = this.registers[mul1]*this.registers[mul2];
          break;
        case 0x06: //DIV
          var div1 = this.ram[i++];
          var div2 = this.ram[i++];
          this.registers[div1] = this.registers[div1]/this.registers[div2];
          break;
        case 0x0F: //TST
          alert(Array.from(this.ram.slice(0, 16)));
          alert(Array.from(this.registers.slice(0, 16)));
          break;
        case 0xFF: //STP
          running = false;
          break;
        default:
          throw new Error("Opcode not recognized");
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
