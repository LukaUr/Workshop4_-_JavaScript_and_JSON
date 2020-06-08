$(() => {
    const zadRozg1 = () => {
        $.ajax({
            url: "http://date.jsontest.com",
            contentType: "application/json",
            dataType: "JSON",
            method: "GET"
        }).done((response) => {
            alert(response.date)
        })
    }
    const zadRozg2 = () => {
        $.ajax({
            url: "https://swapi.dev/api/people/1/",
            contentType: "application/json",
            dataType: "JSON",
            method: "GET"
        }).done((response) => {
            console.log(JSON.stringify(response))
        })
    }
    zadRozg1();
    zadRozg2();
});