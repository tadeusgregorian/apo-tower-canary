import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

export default () => {
  iziToast.settings({
      position: 'topRight',
      timeout: 4000,
      //resetOnHover: true,
      //icon: 'icon-alarm_on',
      transitionIn: 'flipInX',
      transitionOut: 'fadeOut',
      progressbar: false,
      animateInside: false,
  });
}
