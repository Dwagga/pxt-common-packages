namespace jacdac {
    export class ActuatorService extends Service {
        stateLength: number;
        state: Buffer;

        constructor(name: string, deviceClass: number, stateLength: number, controlDataLength?: number) {
            super(name, deviceClass, controlDataLength);
            this.stateLength = stateLength;
            this.state = control.createBuffer(this.stateLength);
        }

        public handlePacket(pkt: Buffer): boolean {
            const packet = new JDPacket(pkt);
            const st = packet.data;
            if (st.length < this.stateLength) {
                this.log(`invalid data`)
                return false;
            }
                
            this.state = st;
            return this.handleStateChanged();
        }

        protected handleStateChanged(): boolean {
            return true;
        }
    }

    export class ActuatorClient extends Client {
        protected state: Buffer;

        constructor(name: string, deviceClass: number, stateLength: number, controlDataLength?: number) {
            super(name, deviceClass, controlDataLength);
            this.state = control.createBuffer(stateLength);
            this.onDriverEvent(JacDacDriverEvent.Connected, () => this.notifyChange());
        }

        protected notifyChange() {
            this.sendPacket(this.state)
        }
    }
}