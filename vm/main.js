class VM {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.ctx = this.canvas.getContext("2d");
  }

  ram = new Uint32Array(8291428);
  registers = new Uint32Array(64);
  gpu = {
    enabled: false,
    width: 0,
    height: 0,
    fbAddr: 0
  };
  ramidx = 0;
  
  start() {
    var i=0;
    var running = true;
    while (running) {
      switch(this.ram[i++]) {
        case 0: //NIL
          break;
        case 0x00000001: //STI
          var reg = this.ram[i++];
          var val = this.ram[i++];
          this.registers[reg] = val;
          break;
        case 0x00000002: //STR
          var reg = this.ram[i++];
          var val = this.ram[i++];
          this.registers[reg] = this.ram[val];
          break;
        case 0x00000003: //LDI
          var mem = this.ram[i++];
          var val = this.ram[i++];
          if (mem < 1024 || mem >= 1028) {
            this.ram[mem] = val;
          }
          else if (mem < 1028 && mem >= 1024) {
            switch(mem) {
              case 1024:
                this.gpu.enabled = true;
                break;
              case 1025:
                this.gpu.width = val;
                break;
              case 1026:
                this.gpu.height = val;
                break;
              case 1027:
                var imageData = this.ctx.getImageData(0, 0, this.gpu.width, this.gpu.height);
                var data = imageData.data;
                for (let p = 0; p < (this.gpu.width * this.gpu.height); p++) {
                  let pixel = this.ram[1028 + p] >>> 0;
                  let base = p * 4;
                  data[base]     = (pixel >> 24) & 0xFF; // R
                  data[base + 1] = (pixel >> 16) & 0xFF; // G
                  data[base + 2] = (pixel >> 8)  & 0xFF; // B
                  data[base + 3] = pixel & 0xFF;         // A
                }
                this.ctx.putImageData(imageData, 0, 0);
                break;
            }
          }
          break;
        case 0x00000004: //LDR
          var mem = this.ram[i++];
          var reg = this.ram[i++];
          this.ram[mem] = this.registers[reg];
          break;
        case 0x0000000F: //TST
          alert(Array.from(this.ram.slice(0, 16)));
          alert(Array.from(this.registers.slice(0, 16)));
          break;
        case 0xFFFFFFFF: //STP
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
