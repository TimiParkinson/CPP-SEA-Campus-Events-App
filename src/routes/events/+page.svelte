<main>
    <h1>Your Events</h1>

    <div id="selectionTabs" style="display:flex">
        <button class="button"><p style="margin-right:4px; margin-left:4px;">E-Sports</p></button>
        <button class="button"><p style="margin-right:4px; margin-left:4px;">SEA Events</p></button>
        <button class="button"><p style="margin-right:4px; margin-left:4px;">Workshops</p></button>
        <button class="button"><p style="margin-right:4px; margin-left:4px;">Bronco Pride</p></button>
        <button class="button"><p style="margin-right:4px; margin-left:4px;">NSBE Events</p></button>
    </div>

    <div id="eventTabs" style="display:flex">
        <div id="event">
            <!-- <img src="imageSRC.jpg" alt="ScreenReaderText"> -->
            <div id="fakeImageReplaceLater">
            </div>
            <h2>Code & Coffee</h2>
            09/29/2025
        </div>
        <div id="event">
            <!-- <img src="imageSRC.jpg" alt="ScreenReaderText"> -->
            <div id="fakeImageReplaceLater">
            </div>
            <h2>SEA Tech Talks</h2>
            09/30/2025
        </div>
    </div>
</main>
<style>
    main{
        height: 100%;
    }
    h1{
        font-size: 2em;
    }
    p{
        margin-left: 4px;
        margin-right: 4px;
    }
    .button{
        border-radius: 5px;
        border-width: 2px;
        border-color: rgb(193, 193, 193);
        margin-left: 2px;
        margin-right: 2px;
    }
    #selectionTabs{
        margin-bottom: 16px;
        margin-top: 20px;
    }
    #fakeImageReplaceLater{
        background-color: blue;
        height:160px;
        width:200px;
        border-radius: 16px;
    }
    #event{
        margin-right: 8px;
    }
</style>