function sleep(ms: number): Promise<any> {
	return new Promise<any>(resolve => setTimeout(resolve, ms));
}

class fancy_write { 
	running: boolean
	full_text: string
	element: HTMLElement

	index: number

	delay_on_delete: number = 100
	delay_on_type: number = 250
	delay_on_newline: number = 1000
	delay_on_punctuation: number = 400

	async start(element_id: string, text: string) {
		if (this.running) return
		var e = document.getElementById(element_id)
		if (e == null) return
		this.element = e
		this.full_text = text
		this.index = 0
		await this.run()
	}

	async clear() {
		while (this.element.innerText.length > 0) {
			this.element.innerText = this.element.innerText.slice(0, this.element.innerText.length - 1)
			await sleep(this.delay_on_delete);
		}
	}

	async run() {
		if (this.running) return
		this.running = true
		await this.clear()
		while (this.index < this.full_text.length) {
			if (!this.running) return
			var char = this.full_text[this.index]
			if (char == '\n') {
				await sleep(this.delay_on_newline)
				await this.clear()
				this.full_text = this.full_text.slice(this.index + 1)
				this.index = 0
				continue
			} else if (char == ' ') {
				await sleep(this.delay_on_punctuation)
			} else {
				await sleep(this.delay_on_type)
			}
			this.element.textContent += char
			this.index += 1
		}
		this.running = false
	}
}


async function main() {
	var f1 = new fancy_write()
	var f2 = new fancy_write()
	var f2p = f2.start('subtitle', '...\n...\n...\n...\n...\n...')
	await f1.start('title', "Hello!\nI'm Grady!\nGrady Clark")
	f2.running = false
	await f2p
	await f2.start('subtitle', 'Software Engineer')
}

main()