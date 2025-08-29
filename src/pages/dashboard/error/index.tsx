function ErrorFallback() {
  const redirectHome = () => {
    window.location.href = '/';
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <h1>500</h1>
        <p>Что-то пошло не так...</p>
        <button type="button" onClick={() => redirectHome()}>
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}

export { ErrorFallback };
