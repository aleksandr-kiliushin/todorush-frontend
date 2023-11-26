import { request } from '#utils/request'
import { createResource, Show, For } from 'solid-js'
import { render } from 'solid-js/web'
import { TTask, TUser } from '#types/index'

const App = () => {
  const [authorizedUser, { refetch: refetchAuthorizedUser }] = createResource(async () => {
    try {
      const response = await request.get<TUser>({ url: '/api/me' })
      return response.data
    } catch {
      return null
    }
  })

  const onAuthorize = async (event: Event) => {
    event.preventDefault()

    if (!(event.target instanceof HTMLFormElement)) {
      return
    }

    const formData = new FormData(event.target)

    try {
      const response = await request.post<{ authorization_token: string }>({
        payload: {
          verification_code: formData.get('verification-code'),
        },
        url: '/api/authorize',
      })

      localStorage.setItem('authorizationToken', response.data.authorization_token)

      refetchAuthorizedUser()
      refetchTasks()
    } catch {
      //
    }
  }

  const [tasks, { refetch: refetchTasks }] = createResource(
    async () => {
      try {
        const response = await request.get<TTask[]>({ url: '/api/tasks' })
        return response.data
      } catch {
        return []
      }
    },
    { initialValue: [] }
  )

  const addTask = async (event: Event) => {
    event.preventDefault()

    if (!(event.target instanceof HTMLFormElement)) {
      return
    }

    const formData = new FormData(event.target)
    const title = formData.get('title')

    if (typeof title !== 'string' || title.length < 1) {
      return
    }

    try {
      await request.post({ url: '/api/tasks', payload: { title } })
      const taskTitleInput = document.querySelector('#title')
      if (taskTitleInput instanceof HTMLInputElement) {
        taskTitleInput.value = ''
      }
      await refetchTasks()
    } catch {
      //
    }
  }

  const deleteTask = async (taskId: TTask['id']) => {
    try {
      await request.delete({ url: `/api/tasks/${taskId}` })

      refetchTasks()
    } catch {
      //
    }
  }

  return (
    <>
      <h1>TODORUSH</h1>
      {/* ADD A TASK */}
      <Show when={authorizedUser() !== null}>
        <hr />
        <section style="background-color: #bbbbbb;">
          <h2>Add a task</h2>
          <form onSubmit={addTask}>
            <label for="title">Title</label>
            <input type="text" id="title" name="title" />
            <button type="submit">Submit</button>
          </form>
        </section>
      </Show>
      {/* TASKS LIST */}
      <Show when={authorizedUser() !== null}>
        <hr />
        <section style="background-color: #dddddd;">
          <h2>TODOs</h2>
          <ul>
            <For each={tasks()}>
              {(task) => (
                <li style="margin-bottom: 8px;">
                  #{task.id}: {task.title}
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    style="margin-left: 4px;"
                  >
                    Delete
                  </button>
                </li>
              )}
            </For>
            <Show when={tasks().length === 0}>
              <li>No TODOs</li>
            </Show>
          </ul>
        </section>
      </Show>
      {/* AUTHORIZED USER */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <section style="background-color: #bbbbbb;">
        <h2>User:</h2>
        <pre>{JSON.stringify(authorizedUser(), null, 2)}</pre>
      </section>
      {/* AUTHORIZATION FORM */}
      <Show when={authorizedUser() === null}>
        <hr />
        <section style="background-color: #dddddd;">
          <h2>Authorization form</h2>
          <p>
            To get verification code, visit{' '}
            <a href="https://t.me/TodoRushBot" target="_blank" rel="noopener">
              Telegram TodoRushBot
            </a>{' '}
            and execute there <code>/verification_code</code> command.
          </p>
          <form onSubmit={onAuthorize}>
            <label for="verification-code">Verification code</label>
            <input type="text" id="verification-code" name="verification-code" />
            <button type="submit">Submit</button>
          </form>
        </section>
      </Show>
      {/* LOGOUT */}
      <Show when={authorizedUser() !== null}>
        <hr />
        <section style="background-color: #bbbbbb;">
          <h2>Logout</h2>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('authorizationToken')
              refetchAuthorizedUser()
            }}
          >
            Logout
          </button>
        </section>
      </Show>
    </>
  )
}

const rootNode = document.querySelector('#root')
if (rootNode === null) {
  throw new Error('#root is not found, cannot mount the app.')
}

render(App, rootNode)
