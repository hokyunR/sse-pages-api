import React from "react";

export default function Home() {
  const [data, setData] = React.useState("");

  const listener = (event: any) => setData(JSON.parse(event.data));

  React.useEffect(() => {
    const eventSource = new EventSource("/event-source");

    eventSource.addEventListener("event", listener);
    eventSource.addEventListener("error", (error) => {
      console.log(error);
    });

    return () => {
      eventSource.removeEventListener("event", listener);
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <form
        style={{ display: "flex", gap: "8px" }}
        onSubmit={(event) => {
          event.preventDefault();
          const textInput = event.currentTarget.text;
          fetch("/event-source", {
            method: "POST",
            body: JSON.stringify(textInput.value),
          }).then((res) => {
            if (res.ok) {
              textInput.value = "";
            }
          });
        }}
      >
        <input type="text" name="text" />
        <button type="submit">Send Message</button>
      </form>
      <div style={{ marginTop: "24px" }}>{data}</div>
    </div>
  );
}
