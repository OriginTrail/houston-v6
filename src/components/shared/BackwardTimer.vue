<template>
  <div class="backward-timer label-inline-12">
    {{ currentTime }}
  </div>
</template>

<script>
import * as moment from 'moment';
export default {
  name: 'BackwardTimer',
  props: {
    startTimestamp: {
      type: Number,
      default: 0,
    },
    endTimestamp: {
      type: Number,
      default: 0,
    },
    instantlyStart: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentTime: '00:00:00:00',
      timerStarted: false,
      interval: null,
    };
  },
  mounted() {},
  methods: {
    stopTimer() {
      clearInterval(this.interval);
      this.currentTime = '00:00:00:00';
      this.$emit('over');
      return;
    },
    startTimer() {
      let currentTime = this.startTimestamp ?? moment().unix(); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
      let eventTime = this.endTimestamp ?? 1366547400; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
      let diffTime = eventTime - currentTime;
      let duration = moment.duration(diffTime * 1000, 'milliseconds');
      let interval = 1000;
      this.timerStarted = true;
      this.interval = setInterval(() => {
        duration = moment.duration(duration - interval, 'milliseconds');
        this.currentTime =
          duration.days() +
          ':' +
          `${duration.hours() < 10 ? '0' : ''}${duration.hours()}` +
          ':' +
          `${duration.minutes() < 10 ? '0' : ''}${duration.minutes()}` +
          ':' +
          `${duration.seconds() < 10 ? '0' : ''}${duration.seconds()}`;
        if (duration.seconds() < 0) {
          this.stopTimer();
        }
      }, interval);
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable.scss';
.backward-timer {
  color: $black;
}
</style>
