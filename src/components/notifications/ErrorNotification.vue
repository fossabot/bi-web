<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <b-notification type="is-danger" v-bind:active.sync="active" aria-close-label="Close Notification" 
    role="alert">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
            <AlertCircleIcon size="1.5x"></AlertCircleIcon>
        </div>
        <div class="level-item">
            {{msg}}
        </div>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AlertCircleIcon } from 'vue-feather-icons'

@Component({
  components: {AlertCircleIcon}
})
export default class ErrorNotification extends Vue {
  public active: boolean = false;
  public msg : string = '';
}

</script>