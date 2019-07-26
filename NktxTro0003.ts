declare var Protracker: any;
declare var Lite13Module: any;

class NktxTro0003 {
  private cognition: Cognition.Core = new Cognition.Core("screen");
  private textPrinter: Cognition.ICognitionEffect;

  public run = () => {
    // Set up the textprinter
    this.textPrinter = new Cognition.TextPrinter();
    this.textPrinter.initialize(this.cognition.displayContext, "font", 16, 16);

    // Set up the modplayer
    var modplayer = new Protracker();

    // Load the module
    var encodedModule = window.atob(Lite13Module);

    // Decode the module back from base64 into a byte array
    var moduleLength = encodedModule.length;
    var moduleBytes = new Uint8Array(new ArrayBuffer(encodedModule.length));

    for (let i = 0; i < moduleLength; i++) {
      moduleBytes[i] = encodedModule.charCodeAt(i);
    }

    let moduleParser = new Cognition.Audio.ProTrackerModuleParser();
    let module = moduleParser.Parse(moduleBytes);
    console.log("ModuleType: " + module.ModuleType);
    console.log("SongName: " + module.SongName);
    console.log("ChannelCount: " + module.Channels.length);
    console.log("SampleCount: " + module.Samples.length);
    console.log(module.Samples[0].Name + " - " + module.Samples[0].SizeInBytes);
    console.log(module.Samples[1].Name + " - " + module.Samples[1].SizeInBytes);
    console.log(
      module.Samples[30].Name + " - " + module.Samples[30].SizeInBytes
    );
    //module.Samples.forEach(sample => console.log(sample.Name.length));

    // TODO: moduleBytes contains the Lite13 ProTracker module but we can't use it yet.
    // First, we need to implement the code to parse the pattern and sample data from the module.
    // Then we need to create a "mixer" web audio processing node with an "onaudioprocess" event
    // which will be called by the web audio API when it needs more sample data.
    // The "onaudioprocess" event handler for the "mixer" node will then need to figure out:
    //  1. Which samples should be playing across all the channels of the module right now.
    //  2. Apply/emulate any module effect.
    //  3. Mix the samples into one (mono) or two (stereo) channels.

    // Create a web audio context
    let audioContext = new AudioContext();

    // Create a white noise generator audio processing node with a 4096 sample
    // buffer size, one input channel and two output channels (stereo)
    let whiteNoiseGeneratorAudioNode = audioContext.createScriptProcessor(
      4096,
      1,
      2
    );

    // The "onaudioprocess" event is called by the web audio API
    whiteNoiseGeneratorAudioNode.onaudioprocess = function(
      ev: AudioProcessingEvent
    ) {
      // The output buffer holds the sample data we want to play
      var output = ev.outputBuffer.getChannelData(0);

      // Generate some random sample data to simulate white noise
      for (var i = 0; i < output.length; i++) {
        output[i] = Math.random();
      }
    };

    // Wire up the white noise generator to the audio context destination (i.e. the speakers)
    whiteNoiseGeneratorAudioNode.connect(audioContext.destination);

    this.loop();
  };

  private renderFrame() {
    // Set the background colour
    this.cognition.setBackgroundColour("#2A57A1");

    // Run the text printer
    this.textPrinter.draw(
      "PROTRACKER MODULE REPLAYER - WORK IN PROGRESS",
      20,
      300
    );

    this.textPrinter.draw(
      "(WELL, IT'S A WHITE NOISE GENERATOR SO FAR!)",
      40,
      320
    );

    this.textPrinter.draw("NEOKORTEX", 642, 550);
    this.textPrinter.draw("COGNITION", 642, 570);
  }

  public loop = () => {
    // Main intro loop (assume 60fps or test for it!)
    this.renderFrame();
    requestAnimationFrame(this.loop);
  };
}