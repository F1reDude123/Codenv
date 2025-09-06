class VM {
  ramSize;
  registerCount;
  constructor(ramSize = 1024, registerCount = 64) {
    this.ram = new Uint8Array(ramSize);
    this.registers = new Uint8Array(registerCount);
    this.gpu = {
      "enabled":false,
      "width":0,
      "height":0,
      "fbAddr":0
    }
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  ramidx=0;
  
  start() {
    var i=0;
    var running = true;
    while (running) {
      switch(this.ram[i++]) {
        case 0x00: //NIL
          break;
        case 0x01: //STI
          var reg = this.ram[i++];
          var val = this.ram[i++];
          this.registers[reg] = val;
          break;
        case 0x02: //STR
          var reg = this.ram[i++];
          var val = this.ram[i++];
          this.registers[reg] = this.ram[val];
          break;
        case 0x03: //LDI
          var mem = this.ram[i++];
          var val = this.ram[i++];
          if (mem < 0xF0) {
            this.ram[mem] = val;
          }
          else {
            switch(mem) {
              case 0xF0:
                this.gpu["enabled"] = true;
                break;
              case 0xF4:
                this.canvas.width = val;
                this.gpu["width"] = val;
                this.gpu["fbAddr"] = this.ram.length-this.gpu["width"]*this.gpu["height"]*4;
                break;
              case 0xF8:
                this.canvas.height = val;
                this.gpu["height"] = val;
                this.gpu["fbAddr"] = this.ram.length-this.gpu["width"]*this.gpu["height"]*4;
                break;
              case 0xFC:
                var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                var data = imageData.data;
                var idx=0;
                var pixels = this.ram.slice(this.gpu["fbAddr"], this.ram.length);
                for (var pix=0;pix<pixels.length;pix++) {
                  data[idx++] = pixels[pix];
                  data[idx++] = pixels[pix];
                  data[idx++] = pixels[pix];
                  data[idx++] = 255;
                }
                this.ctx.putImageData(imageData, 0, 0);
                break;
              default:
                this.ram[mem] = val;
            }
          }
        break;
        case 0x04: //LDR
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
