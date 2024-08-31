
export default class Notifications {

    private divEl: HTMLDivElement;

    constructor(id: string) {
        this.divEl = document.createElement('div');
        this.divEl.classList.add(id);
        document.body.appendChild(this.divEl)
    }

    triger(icon: string, text: string, subtext?: string) : void {
        let div = document.createElement('div');
        div.classList.add('notify');
        div.innerHTML = icon;
        let span = document.createElement('span');
        span.innerText = text;
        div.appendChild(span);
        if (subtext !== undefined) {
            let br = document.createElement('br');
            div.appendChild(br);
            let p = document.createElement('p');
            p.innerText = subtext;
            div.appendChild(p);
        }
        setTimeout(() => {div.remove()}, 6000);

        this.divEl.appendChild(div);
    }
}