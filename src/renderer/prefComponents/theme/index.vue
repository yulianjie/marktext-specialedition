<template>
  <div class="pref-theme">
    <h4>{{ $t('theme.title') }}</h4>
    <section class="offcial-themes">
      <div v-for="t of themes" :key="t.name" class="theme"
        :class="[t.name, { 'active': t.name === theme }]"
        @click="onSelectChange('theme', t.name)"
      >
        <div v-html="t.html"></div>
      </div>
    </section>

    <template v-if="userThemes.length">
      <h4 style="margin-top: 24px;">{{ $t('theme.customThemes') }}</h4>
      <section class="offcial-themes user-themes">
        <div v-for="t of userThemes" :key="t.id" class="theme user-theme"
          :class="['type-' + t.type, { 'active': t.id === theme }]"
          @click="onSelectChange('theme', t.id)"
          :title="t.id"
        >
          <h3>{{ t.name }}</h3>
          <p>{{ $t('theme.fromFolder') }}</p>
        </div>
      </section>
    </template>

    <separator></separator>
    <cur-select
      :description="$t('theme.autoSwitch.desc')"
      :value="autoSwitchTheme"
      :options="autoSwitchThemeOptions"
      :onChange="value => onSelectChange('autoSwitchTheme', value)"
    ></cur-select>
    <separator></separator>
    <section class="import-themes">
      <div>
        <span>{{ $t('theme.openFolderHelp') }}</span>
        <el-button size="small" @click="onOpenFolder">{{ $t('theme.openFolderBtn') }}</el-button>
      </div>
      <div>
        <span>{{ $t('theme.reloadHelp') }}</span>
        <el-button size="small" @click="onReload">{{ $t('theme.reloadBtn') }}</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ipcRenderer } from 'electron'
import themeMd from './theme.md'
import { buildAutoSwitchThemeOptions, themes } from './config'
import markdownToHtml from '@/util/markdownToHtml'
import CurSelect from '../common/select'
import Separator from '../common/separator'

export default {
  components: {
    CurSelect,
    Separator
  },
  data () {
    return {
      themes: [],
      userThemes: []
    }
  },
  computed: {
    ...mapState({
      autoSwitchTheme: state => state.preferences.autoSwitchTheme,
      theme: state => state.preferences.theme
    }),
    autoSwitchThemeOptions () {
      return buildAutoSwitchThemeOptions(this.$t.bind(this))
    }
  },
  created () {
    this.$nextTick(async () => {
      const newThemes = []
      for (const theme of themes) {
        const html = await markdownToHtml(themeMd.replace(/{theme}/, theme.name))
        newThemes.push({
          name: theme.name,
          html
        })
      }
      this.themes = newThemes
    })

    this._onUserThemes = (_, list) => {
      this.userThemes = Array.isArray(list) ? list : []
    }
    ipcRenderer.on('mt::user-themes', this._onUserThemes)
    ipcRenderer.send('mt::ask-for-user-themes')
  },
  beforeDestroy () {
    if (this._onUserThemes) {
      ipcRenderer.removeListener('mt::user-themes', this._onUserThemes)
    }
  },
  methods: {
    onSelectChange (type, value) {
      this.$store.dispatch('SET_SINGLE_PREFERENCE', { type, value })
    },
    onOpenFolder () {
      ipcRenderer.send('mt::open-user-themes-folder')
    },
    onReload () {
      ipcRenderer.send('mt::reload-user-themes')
    }
  }
}
</script>

<style>
  .offcial-themes {
    margin-top: 12px;
    & .theme {
      cursor: pointer;
      width: 248px;
      height: 100px;
      margin: 0px 20px 10px 20px;
      padding-left: 30px;
      padding-top: 20px;
      overflow: hidden;
      display: inline-block;
      background: var(--editorBgColor);
      color: var(--editorColor);
      box-sizing: border-box;
      box-shadow: 0 9px 28px -9px rgba(0, 0, 0, .4);
      border-radius: 5px;
      &.dark {
        color: rgba(255, 255, 255, .7);
        background: #282828;
        & a {
          color: #409eff;
        }
      }
      &.light {
        color: rgba(0, 0, 0, .7);
        background: rgba(255, 255, 255, 1);
        & a {
          color: rgba(33, 181, 111, 1);;
        }
      }
      &.graphite {
        color: rgba(43, 48, 50, .7);
        background: #f7f7f7;
        & a {
          color: rgb(104, 134, 170);
        }
      }
      &.material-dark {
        color: rgba(171, 178, 191, .8);
        background: #34393f;
        & a {
          color: #f48237;
        }
      }
      &.one-dark {
        color: #9da5b4;
        background: #282c34;
        & a {
          color: rgba(226, 192, 141, 1);
        }
      }
      &.ulysses {
        color: rgba(101, 101, 101, .7);
        background: #f3f3f3;
        & a {
          color: rgb(12, 139, 186);
        }
      }
      &.minimalist {
        color: #1f1f1f;
        background: #fdfcfa;
        font-family: "Iowan Old Style", "Source Serif Pro", Georgia, serif;
        & a {
          color: #1f1f1f;
        }
      }
      &.glass {
        color: rgba(28, 25, 46, .88);
        background:
          radial-gradient(80% 80% at 20% 0%, rgba(123, 92, 255, .35), transparent 60%),
          radial-gradient(80% 80% at 90% 100%, rgba(56, 189, 248, .35), transparent 60%),
          linear-gradient(135deg, #fdf3ff, #e8f1ff);
        & a {
          color: #7b5cff;
        }
      }
      &.macos {
        color: #1d1d1f;
        background: #ffffff;
        box-shadow: 0 8px 24px -10px rgba(0, 0, 0, .22), 0 1px 3px rgba(0, 0, 0, .06);
        & a {
          color: #007aff;
        }
      }
    }
    & .theme.active {
      box-shadow: 0 0 0 2px var(--themeColor), 0 9px 28px -9px rgba(0, 0, 0, .4);
    }
    & .user-theme {
      color: rgba(0, 0, 0, .7);
      background: #fafafa;
      padding: 18px 20px;
      &.type-dark {
        color: rgba(255, 255, 255, .85);
        background: #282828;
      }
      & h3 {
        margin: 0 0 6px 0;
        font-size: 15px;
        font-weight: 600;
      }
      & p {
        margin: 0;
        font-size: 12px;
        opacity: .55;
      }
    }
    & h3 {
      margin: 0;
      font-size: 16px;
      color: currentColor;
      cursor: pointer;
      &::before {
        content: 'h3';
        position: absolute;
        top: 4px;
        left: -20px;
        display: block;
        width: 10px;
        height: 10px;
        font-size: 12px;
        opacity: .5;
      }
    }
    & p {
      font-size: 12px;
    }
  }
  .import-themes {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--editorColor);
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      & > span {
        font-size: 13px;
        opacity: .85;
      }
    }
  }
</style>
