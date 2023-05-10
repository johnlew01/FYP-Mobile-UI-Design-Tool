<template>
  <v-dialog v-model="localDialogVisible" @click:outside="resetForm">
    <v-card>
      <v-card-title>Enter your pattern information</v-card-title>
      <v-card-text>
        <v-form enctype="multipart/form-data">
          <v-text-field v-model="name" label="Pattern name"></v-text-field>
          <v-text-field v-model="problem" label="Problem"></v-text-field>
          <v-text-field v-model="solution" label="Solution"></v-text-field>
          <v-text-field v-model="context" label="Context"></v-text-field>
          <v-text-field v-model="rationale" label="Rationale"></v-text-field>
          <v-text-field v-model="examples" label="Examples"></v-text-field>
          <hr />
          <v-card-title>Learnability</v-card-title>
          <div class="checkbox">
            <v-checkbox
              v-model="learnability"
              value="Good"
              label="Learnability (Good)"
            ></v-checkbox>
            <v-checkbox
              v-model="learnability"
              value="Bad"
              label="Learnability (Bad)"
            ></v-checkbox>
          </div>
          <hr />
          <v-card-title>Efficiency</v-card-title>
          <div class="checkbox">
            <v-checkbox
              v-model="efficiency"
              value="Good"
              label="Efficiency (Good)"
            ></v-checkbox>
            <v-checkbox
              v-model="efficiency"
              value="Bad"
              label="Efficiency (Bad)"
            ></v-checkbox>
          </div>
          <hr />
          <v-card-title>Satisfaction</v-card-title>
          <div class="checkbox">
            <v-checkbox
              v-model="satisfaction"
              value="Good"
              label="Satisfaction (Good)"
            ></v-checkbox>
            <v-checkbox
              v-model="satisfaction"
              value="Bad"
              label="Satisfaction (Bad)"
            ></v-checkbox>
          </div>
          <hr />
          <v-card-title>Reliability</v-card-title>
          <div class="checkbox">
            <v-checkbox
              v-model="reliability"
              value="Good"
              label="Reliability (Good)"
            ></v-checkbox>
            <v-checkbox
              v-model="reliability"
              value="Bad"
              label="Reliability (Bad)"
            ></v-checkbox>
          </div>
          <hr />
          <v-card-title>Desirability</v-card-title>
          <div class="checkbox">
            <v-checkbox
              v-model="desirability"
              value="Good"
              label="Desirability (Good)"
            ></v-checkbox>
            <v-checkbox
              v-model="desirability"
              value="Bad"
              label="Desirability (Bad)"
            ></v-checkbox>
          </div>
          <hr />

          <v-file-input
            type="file"
            ref="file"
            @change="selectFile"
            label="Choose a file"
          ></v-file-input>
          <div
            v-if="message"
            :class="`message ${error ? 'is-danger' : 'is-success'}`"
          >
            <div class="message-body">{{ message }}</div>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancelUpload">Cancel</v-btn>
        <v-btn @click="validateForm()" color="primary">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "MultipleUploads",
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localDialogVisible: false,
      name: "",
      problem: "",
      context: "",
      solution: "",
      rationale: "",
      examples: "",
      learnability: "",
      efficiency: "",
      satisfaction: "",
      reliability: "",
      desirability: "",
      file: "",
      message: "",
      error: false,
    };
  },
  watch: {
    dialogVisible(value) {
      this.localDialogVisible = value;
    },
    localDialogVisible(value) {
      this.$emit("update:dialogVisible", value);
    },
  },
  methods: {
    selectFile() {
      const file = this.$refs.file.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const MAX_SIZE = 200000;
      const tooLarge = file.size > MAX_SIZE;
      if (allowedTypes.includes(file.type) && !tooLarge) {
        this.file = file;
        this.error = false;
        this.message = "";
      } else {
        this.error = true;
        this.message = tooLarge
          ? `Too large. Max size is ${MAX_SIZE / 1000}Kb`
          : "Only images are allowed";
      }
    },
    emitInfoEntered() {
      const info = {
        name: this.name,
        problem: this.problem,
        solution: this.solution,
        context: this.context,
        rationale: this.rationale,
        examples: this.examples,
        learnability: this.learnability.toUpperCase(),
        effieciency: this.efficiency.toUpperCase(),
        satisfaction: this.satisfaction.toUpperCase(),
        reliability: this.reliability.toUpperCase(),
        desirability: this.desirability.toUpperCase(),
        file: this.file.name,
      };
      this.$emit("info-entered", info);
      this.localDialogVisible = false;
    },
    async sendFile() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("problem", this.problem);
      formData.append("solution", this.solution);
      formData.append("context", this.context);
      formData.append("rationale", this.rationale);
      formData.append("examples", this.examples);
      formData.append("learnability", this.learnability.toUpperCase());
      formData.append("efficiency", this.efficiency.toUpperCase());
      formData.append("satisfaction", this.satisfaction.toUpperCase());
      formData.append("reliability", this.reliability.toUpperCase());
      formData.append("desirability", this.desirability.toUpperCase());
      formData.append("file", this.file);

      try {
        await axios.post("http://localhost:5000/components", formData);
        this.message = "File has been uploaded";
        this.file = "";
        this.error = false;
        const response = await axios.get("http://localhost:5000/components");
        this.components = response.data;
        this.$emit("components-loaded", this.components);
        console.log("Event emitted with data:", this.components);
      } catch (error) {
        console.log(error);
      }
      this.resetForm();
      // location.reload();
    },
    cancelUpload() {
      const info = {
        name: this.name,
        problem: this.problem,
        solution: this.solution,
        context: this.context,
        rationale: this.rationale,
        examples: this.examples,
        learnability: this.learnability.toUpperCase(),
        effieciency: this.efficiency.toUpperCase(),
        satisfaction: this.satisfaction.toUpperCase(),
        reliability: this.reliability.toUpperCase(),
        desirability: this.desirability.toUpperCase(),
        file: this.file.name,
      };
      this.$emit("info-entered", info);
      this.resetForm();
    },
    validateForm() {
      const inputs = [
        this.name,
        this.problem,
        this.solution,
        this.context,
        this.rationale,
        this.examples,
        this.learnability,
        this.efficiency,
        this.satisfaction,
        this.reliability,
        this.desirability,
      ];
      const emptyFields = inputs.filter((input) => !input.trim().length);
      if (emptyFields.length > 0) {
        this.error = true;
        this.message = "Please fill in all fields";
        return;
      }

      this.emitInfoEntered();
      this.sendFile();
    },
    resetForm() {
      // Reset form fields
      this.name = "";
      this.problem = "";
      this.solution = "";
      this.context = "";
      this.rationale = "";
      this.examples = "";
      this.learnability = "";
      this.efficiency = "";
      this.satisfaction = "";
      this.reliability = "";
      this.desirability = "";
      this.file = "";
      this.message = "";
      this.error = false;
      this.localDialogVisible = false;
    },
  },
};
</script>
