<script>
import { mapState } from 'vuex'
import parseAST from 'html-parse-stringify/lib/parse'
import linkifyHtml from 'linkifyjs/html'
import decode from 'entities/lib/decode'

import Message from './Message'
import Quote from './Quote'
import Member from './Member'
import Pic from './Pic'
import Icon from './Icon'
import Anchor from './Anchor'

function getInlineStyle(str) {
  return str
    .split(/\s{0,};\s{0,}/)
    .map(s => {
      const [attr, value] = s.split(/\s{0,}:\s{0,}/)
      return [attr.replace(/-([a-z])/g, g => g[1].toUpperCase()), value]
    })
    .reduce(
      (accum, prop) => ({
        ...accum,
        [prop[0]]: prop[1],
      }),
      {},
    )
}

export default {
  props: ['html'],
  components: {
    Message,
    Quote,
    Member,
    Pic,
    Icon,
    Anchor,
  },
  computed: {
    ...mapState({
      imageProxy: state => state.app.imageProxy,
    }),
    parsedMessage() {
      let message = this.html
      message = linkifyHtml(message)
      message = message.replace(
        /src="\/assets/g,
        'src="https://lihkg.com/assets',
      )
      const ast = parseAST(`<x>${message}</x>`)

      return ast[0].children
    },
  },
  methods: {
    decode(content) {
      return decode.HTML(content)
    },
    renderAST(h, ast, nestInfo = { quote: 1, sub: 1 }) {
      return ast.map(node => {
        if (node.type === 'text') {
          return this.decode(node.content)
        }
        switch (node.name) {
          case 'blockquote': {
            const newNestInfo = {
              ...nestInfo,
              quote: nestInfo.quote + 1,
            }
            return h(
              'quote',
              {
                props: {
                  level: nestInfo.quote,
                  isDeep: nestInfo.quote === 4,
                },
              },
              this.renderAST(h, node.children, newNestInfo),
            )
          }
          case 'strong':
            return h('strong', this.renderAST(h, node.children))
          case 'ins':
            return h('ins', this.renderAST(h, node.children))
          case 'del':
            return h('del', this.renderAST(h, node.children))
          case 'em':
            return h('em', this.renderAST(h, node.children))
          case 'span': {
            return h(
              'span',
              {
                style: getInlineStyle(node.attrs.style),
              },
              this.renderAST(h, node.children),
            )
          }
          case 'div':
            return h(
              'div',
              {
                style: getInlineStyle(node.attrs.style),
              },
              this.renderAST(h, node.children),
            )
          case 'sub': {
            const newNestInfo = {
              ...nestInfo,
              sub: nestInfo.sub + 1,
            }
            return h(
              'member',
              {
                props: {
                  level: nestInfo.sub,
                  isDeep: nestInfo.sub === 4,
                },
              },
              this.renderAST(h, node.children, newNestInfo),
            )
          }
          case 'img': {
            const src = this.decode(node.attrs.src)
            if (node.attrs.class && node.attrs.class.indexOf('hkgmoji') >= 0) {
              return h('icon', {
                props: { src },
              })
            }

            return h('pic', {
              props: {
                src: this.imageProxy ? `https://i.lihkg.com/540/${src}` : src,
                original: src,
              },
            })
          }
          case 'br':
            return h('br')
          case 'a':
            return h(
              'anchor',
              {
                props: {
                  href: this.decode(node.attrs.href),
                },
              },
              this.renderAST(h, node.children),
            )
          default:
            return null
        }
      })
    },
  },
  render(h) {
    return h('div', [this.renderAST(h, this.parsedMessage), this.$slots.link])
  },
}
</script>
