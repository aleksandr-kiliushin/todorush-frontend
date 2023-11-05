import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'

const App = () => {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>Hello, world</div>
      <button
        type="button"
        onClick={() => {
          setCount(count() + 1)
        }}
      >
        Increment
      </button>
      Count: {count()}
    </>
  )
}

render(App, document.querySelector('#root'))
