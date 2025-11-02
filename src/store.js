const { clear } = require('console');
const { randomUUID } = require('crypto');

class MusicStore{
    constructor(){
        this.tracks = [];
        this.nextOrder = 1;

        this.add({ title: "Afterlife", artist: "Avenged Sevenfold", duration: "6:36" });
        this.add({ title: "Papercut", artist: "Linkin Park", duration: "3:04"});
        this.add({ title: "Flying", artist: "Anathema", duration: "7:03"});
    }

    list({played, q}){
        let items = [...this.tracks];
        if(typeof played === "boolean") {
            items = items.filter(t => t.isPlayed === played);
        }
        if(q){
            items = items.filter(t =>
            (t.title  || '').toLowerCase().includes(q.toLowerCase()) || 
            (t.artist || '').toLowerCase().includes(q.toLowerCase())
            );
        }
        return items.sort((a,b) => a.order - b.order);
    }

    get(id){
        return this.tracks.find(t => t.id === id) || null;
    }

    add({ title, artist, duration }){
        const track = {
            id: randomUUID(),
            title,
            artist,
            duration,
            order: this.nextOrder++,
            isPlayed: false
        };
        this.tracks.push(track);
        return track;
    }

    update(id,{ title, artist, duration, isPlayed }){
        const track = this.get(id);
        if(!track) return null;
        track.title = title || track.title;
        track.artist = artist || track.artist;
        track.duration = duration || track.duration;
        track.isPlayed = isPlayed || track.isPlayed;
        return track;
    }

    tickPlayed(id){
        const track = this.get(id);
        if(!track) return null;
        track.isPlayed = !track.isPlayed;
        return track;
    }

    remove(id){
        const lenBefore = this.tracks.length;
        this.tracks = this.tracks.filter(t => t.id !== id);
        return lenBefore !== this.tracks.length;
    }

    clear(){
        const count = this.tracks.length;
        this.tracks = [];
        this.nextOrder = 1;
        return count;
    }
}

module.exports = new MusicStore();