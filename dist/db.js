import fs from 'node:fs';
class Mental {
    filePath;
    db;
    constructor(filePath) {
        if (!filePath.endsWith('.json')) {
            throw new Error('File must be a JSON file');
        }
        this.filePath = filePath;
        this.db = [];
    }
    init() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]');
        }
    }
    refresh() {
        this.db = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.db));
    }
    add(data) {
        this.db.push(data);
        this.save();
    }
    getMostMentionedOS() {
        return this.db.reduce((acc, curr) => {
            if (acc[curr.os] === undefined)
                acc[curr.os] = 1;
            else
                acc[curr.os] += 1;
            return acc;
        }, {});
    }
}
export default Mental;
