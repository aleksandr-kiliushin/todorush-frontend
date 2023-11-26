import { createSignal, createResource, Show, For } from 'solid-js'
import { render } from 'solid-js/web'

const App = () => {
  const [authorizedUser, { refetch: refetchAuthorizedUser }] = createResource(() => {
    return fetch(`${process.env.API_BASE_URL}/api/me`, {
      // @ts-ignore
      headers: {
        Authorization: localStorage.getItem('authorizationToken'),
      },
    })
      .then((response) => response.json())
      .catch((error) => 'Error while fetching authorized user data: ' + error.message)
  })

  // @ts-ignore
  const onAuthorize = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    fetch(`${process.env.API_BASE_URL}/api/authorize`, {
      method: 'POST',
      body: JSON.stringify({
        verification_code: formData.get('verification-code'),
      }),
    })
      .then((response) => response.json())
      .then((responseBody) => {
        if ('error' in responseBody) {
          alert('Authorization error: ' + responseBody.error)
        }
        if ('authorization_token' in responseBody) {
          localStorage.setItem('authorizationToken', responseBody.authorization_token)
          alert('Successfull authorization')
          refetchAuthorizedUser()
          refetchTasks()
        }
      })
  }

  const [tasks, { refetch: refetchTasks }] = createResource(
    () => {
      return fetch(`${process.env.API_BASE_URL}/api/tasks`, {
        // @ts-ignore
        headers: {
          Authorization: localStorage.getItem('authorizationToken'),
        },
      })
        .then((response) => response.json())
        .catch(() => [])
    },
    { initialValue: [] }
  )

  // @ts-ignore
  const addTask = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get('title')

    if (typeof title !== 'string' || title.length < 1) {
      return
    }

    fetch(`${process.env.API_BASE_URL}/api/tasks`, {
      method: 'POST',
      // @ts-ignore
      headers: {
        Authorization: localStorage.getItem('authorizationToken'),
      },
      body: JSON.stringify({ title }, null, 2),
    })
      .then((response) => response.json())
      .then((responseBody) => {
        if ('error' in responseBody) {
          alert('Error while creating task: ' + responseBody.error)
        } else {
          // @ts-ignore
          document.querySelector('#title').value = ''
          refetchTasks()
        }
      })
  }

  const deleteTask = (taskId: number) => {
    fetch(`${process.env.API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      // @ts-ignore
      headers: {
        Authorization: localStorage.getItem('authorizationToken'),
      },
    })
      .then((response) => response.json())
      .then((responseBody) => {
        if ('error' in responseBody) {
          alert('Error while deleting task: ' + responseBody.error)
        } else {
          refetchTasks()
        }
      })
  }

  const [count, setCount] = createSignal(0)

  return (
    <>
      <h1>TODORUSH</h1>
      {/* ADD A TASK */}
      <Show when={authorizedUser()?.user_id}>
        <hr />
        <h2>Add a task</h2>
        <form onSubmit={addTask}>
          <label for="title">Title</label>
          <input type="text" id="title" name="title" />
          <button type="submit">Submit</button>
        </form>
      </Show>
      {/* TASKS LIST */}
      <Show when={authorizedUser()?.user_id}>
        <hr />
        <h2>TODOs</h2>
        <ul>
          <For each={tasks()}>
            {(task) => (
              <li style="margin-bottom: 8px;">
                #{task.id}: {task.title}
                <button type="button" onClick={() => deleteTask(task.id)} style="margin-left: 4px;">
                  Delete
                </button>
              </li>
            )}
          </For>
          <Show when={tasks().length === 0}>
            <li>No TODOs</li>
          </Show>
        </ul>
      </Show>
      {/* AUTHORIZED USER */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>User:</h2>
      <pre>{JSON.stringify(authorizedUser(), null, 2)}</pre>
      {/* AUTHORIZATION FORM */}
      <Show when={authorizedUser()?.error}>
        <hr />
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
      </Show>
      {/* LOGOUT */}
      <Show when={authorizedUser()?.user_id}>
        <hr />
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
      </Show>
      {/* COUNTER */}
      <hr />
      <h2>Counter (essentially important)</h2>
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

// @ts-ignore
render(App, document.querySelector('#root'))
