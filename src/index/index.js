import  '../../static/less/style.css';
import  '../../static/less/style-less.less';
import {ws} from '../../uiti/uiti';
import commons from '../../uiti/common';
let commonjs  =  require('../../uiti/commonjs');
import pyy  from '../../static/img/3.png';

import icon from '../../static/img/2.png';
let domS = document.querySelector('.main-p')
let imgDom = document.querySelector('#imgDom')
let imgDom2 = document.querySelector('#imgDom2')
imgDom.addEventListener('click',function(){
    import('../../uiti/sdk').then(
        (a)=>{
        console.log(a.a)
        }
    )
});
domS.innerHTML = 12335554;
imgDom.src = pyy;
imgDom2.src = icon;
console.log(ws)
//console.log(sd())
console.log(commonjs.a)