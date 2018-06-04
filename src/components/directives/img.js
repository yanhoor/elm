//在img的父元素上v-img="图像url"，如<div v-img="url"></div>

export default{
  inserted(el, binding){
    let color = Math.floor(Math.random()*100000);
    el.style.backgroundColor = '#' + color;
    let img = document.createElement('img');
    el.appendChild(img);
    /*img.onload = () => {
      el.style.backgroundImage = 'url(' + binding.value + ')';
    };*/
    img.src = binding.value;
  },
};
