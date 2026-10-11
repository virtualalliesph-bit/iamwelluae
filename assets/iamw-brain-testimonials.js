
class IAMWTestimonials {
  constructor(root){
    this.root=root;
    this.track=root.querySelector('[data-iamw-track]');
    this.cards=[...root.querySelectorAll('[data-iamw-card]')];
    this.prev=root.querySelector('[data-iamw-prev]');
    this.next=root.querySelector('[data-iamw-next]');
    this.dots=root.querySelector('[data-iamw-dots]');
    this.index=0;
    this.timer=null;
    if(!this.track || !this.cards.length) return;
    this.prev?.addEventListener('click',()=>this.move(-1));
    this.next?.addEventListener('click',()=>this.move(1));
    this.track.addEventListener('scroll',()=>this.onScroll(),{passive:true});
    this.root.addEventListener('mouseenter',()=>this.stop());
    this.root.addEventListener('mouseleave',()=>this.start());
    window.addEventListener('resize',()=>this.buildDots(),{passive:true});
    this.buildDots();
    this.start();
  }
  visibleCount(){return window.innerWidth<768?Number(this.root.dataset.mobileSlides||1):Number(this.root.dataset.desktopSlides||3)}
  maxIndex(){return Math.max(0,this.cards.length-this.visibleCount())}
  cardStep(){
    if(this.cards.length<2) return this.cards[0]?.getBoundingClientRect().width||0;
    const a=this.cards[0].getBoundingClientRect(), b=this.cards[1].getBoundingClientRect();
    return b.left-a.left;
  }
  move(delta){
    this.index=Math.min(this.maxIndex(),Math.max(0,this.index+delta));
    this.track.scrollTo({left:this.cardStep()*this.index,behavior:'smooth'});
    this.paintDots();
  }
  buildDots(){
    if(!this.dots) return;
    this.index=Math.min(this.index,this.maxIndex());
    this.dots.innerHTML='';
    for(let i=0;i<=this.maxIndex();i++){
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label',`Go to testimonial ${i+1}`);
      b.addEventListener('click',()=>{this.index=i;this.track.scrollTo({left:this.cardStep()*i,behavior:'smooth'});this.paintDots()});
      this.dots.appendChild(b);
    }
    this.paintDots();
  }
  paintDots(){
    if(!this.dots) return;
    [...this.dots.children].forEach((d,i)=>d.classList.toggle('is-active',i===this.index));
  }
  onScroll(){
    const step=this.cardStep();
    if(!step) return;
    this.index=Math.min(this.maxIndex(),Math.max(0,Math.round(this.track.scrollLeft/step)));
    this.paintDots();
  }
  start(){
    if(this.root.dataset.autoplay!=='true') return;
    this.stop();
    const speed=Math.max(2000,Number(this.root.dataset.speed||5000));
    this.timer=setInterval(()=>{this.index>=this.maxIndex()?this.index=0:this.index++;this.track.scrollTo({left:this.cardStep()*this.index,behavior:'smooth'});this.paintDots()},speed);
  }
  stop(){if(this.timer){clearInterval(this.timer);this.timer=null}}
}
document.querySelectorAll('[data-iamw-testimonials]').forEach(el=>new IAMWTestimonials(el));
document.addEventListener('shopify:section:load',e=>e.target.querySelectorAll?.('[data-iamw-testimonials]').forEach(el=>new IAMWTestimonials(el)));
