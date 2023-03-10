class PubSub {
  constructor(){
    this.keyFnMap = {}
  }
  subscribe(key, fn){
    if  (typeof fn !== 'function') {
      return;
    }
    if (!this.keyFnMap[key]) {
      this.keyFnMap[key] = []
    }
    this.keyFnMap[key].push(fn)
  }
  publish(key, data){
    let fns = this.keyFnMap[key]
    if(!fns || !fns.length) return
    //来了，这是重点。
    fns.forEach(fn=>{
      fn.call(this, data)
    })
  }
}

export default PubSub
