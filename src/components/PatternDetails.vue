<template>
  <div class="pattern-details">
    <v-container>
      <v-card class="1">
        <v-card-title class="headline mb-0"
          >Pattern Details for ID {{ id }}</v-card-title
        >
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="name"
              label="Pattern name"
              :disabled="!isFormOpen"
            ></v-text-field>
            <v-text-field
              v-model="problem"
              label="Problem"
              :disabled="!isFormOpen"
            ></v-text-field>
            <v-text-field
              v-model="solution"
              label="Solution"
              :disabled="!isFormOpen"
            ></v-text-field>
            <v-text-field
              v-model="context"
              label="Context"
              :disabled="!isFormOpen"
            ></v-text-field>
            <v-text-field
              v-model="rationale"
              label="Rationale"
              :disabled="!isFormOpen"
            ></v-text-field>
            <v-text-field
              v-model="examples"
              label="Examples"
              :disabled="!isFormOpen"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-card-title style="margin-top: 25px">Learnability</v-card-title>
            <div class="checkbox">
              <v-checkbox
                v-model="learnability"
                value="Good"
                label="Learnability (Good)"
                :disabled="!isFormOpen"
              ></v-checkbox>
              <v-checkbox
                v-model="learnability"
                value="Bad"
                label="Learnability (Bad)"
                :disabled="!isFormOpen"
              ></v-checkbox>
            </div>
            <v-card-title>Efficiency</v-card-title>
            <div class="checkbox">
              <v-checkbox
                v-model="efficiency"
                value="Good"
                label="Efficiency (Good)"
                :disabled="!isFormOpen"
              ></v-checkbox>
              <v-checkbox
                v-model="efficiency"
                value="Bad"
                label="Efficiency (Bad)"
                :disabled="!isFormOpen"
              ></v-checkbox>
            </div>
            <v-card-title>Satisfaction</v-card-title>
            <div class="checkbox">
              <v-checkbox
                v-model="satisfaction"
                value="Good"
                label="Satisfaction (Good)"
                :disabled="!isFormOpen"
              ></v-checkbox>
              <v-checkbox
                v-model="satisfaction"
                value="Bad"
                label="Satisfaction (Bad)"
                :disabled="!isFormOpen"
              ></v-checkbox>
            </div>
            <v-card-title>Reliability</v-card-title>
            <div class="checkbox">
              <v-checkbox
                v-model="reliability"
                value="Good"
                label="Reliability (Good)"
                :disabled="!isFormOpen"
              ></v-checkbox>
              <v-checkbox
                v-model="reliability"
                value="Bad"
                label="Reliability (Bad)"
                :disabled="!isFormOpen"
              ></v-checkbox>
            </div>
            <v-card-title>Desirability</v-card-title>
            <div class="checkbox">
              <v-checkbox
                v-model="desirability"
                value="Good"
                label="Desirability (Good)"
                :disabled="!isFormOpen"
              ></v-checkbox>
              <v-checkbox
                v-model="desirability"
                value="Bad"
                label="Desirability (Bad)"
                :disabled="!isFormOpen"
              ></v-checkbox>
            </div>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn
            v-if="!isFormOpen"
            @click="isFormOpen = true"
            color="primary"
            class="mx-4 my-4"
          >
            <v-icon>mdi-pencil</v-icon>
            Edit Pattern
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isFormOpen"
            @click="isFormOpen = false"
            color="error"
            class="mx-4 my-4"
          >
            <v-icon>mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn
            v-if="isFormOpen"
            @click="saveChanges"
            color="primary"
            class="mx-4 my-4"
          >
            <v-icon>mdi-check</v-icon>
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <router-link to="/" class="back-link">Back to Home</router-link>
  </div>
</template>

<script>
export default {
  name: "PatternDetails",
  data() {
    return {
      isFormOpen: false,
      id: null,
      name: null,
      problem: null,
      context: null,
      solution: null,
      rationale: null,
      examples: null,
      learnability: null,
      efficiency: null,
      satisfaction: null,
      reliability: null,
      desirability: null,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;
    this.problem = this.$route.query.problem;
    this.context = this.$route.query.context;
    this.solution = this.$route.query.solution;
    this.rationale = this.$route.query.rationale;
    this.examples = this.$route.query.examples;
    this.learnability = this.$route.query.learnability;
    this.efficiency = this.$route.query.efficiency;
    this.satisfaction = this.$route.query.satisfaction;
    this.reliability = this.$route.query.reliability;
    this.desirability = this.$route.query.desirability;
  },
  methods: {
    saveChanges() {
      const pattern = {
        id: this.id,
        name: this.name,
        problem: this.problem,
        context: this.context,
        solution: this.solution,
        rationale: this.rationale,
        examples: this.examples,
        learnability: this.learnability.toUpperCase(),
        efficiency: this.efficiency.toUpperCase(),
        satisfaction: this.satisfaction.toUpperCase(),
        reliability: this.reliability.toUpperCase(),
        desirability: this.desirability.toUpperCase(),
      };
      console.log(pattern);

      this.$emit("pattern-updated", pattern);
      this.isFormOpen = false;
    },
  },
};
</script>

<style>
.pattern-details {
  padding: 2rem;
  background-color: #d7e4f1;
}

.v-card {
  background-color: #f6ecd2;
}

.v-card__title {
  font-size: 2rem;
}

.v-divider {
  margin-top: 1rem;
  margin-bottom: 2rem;
  border-top-width: 2px;
  border-top-style: solid;
  border-color: #c8c8c8;
}

.v-text-field {
  width: 100%;
  margin: 20px;
  margin-bottom: 1rem;
}

.v-text-field label {
  font-size: 1.2rem;
}

.v-card-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  display: block;
  margin-top: 2rem;
  text-decoration: none;
  color: #a6a6a6;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
}

.back-link:hover {
  color: #333;
}

.v-btn.primary {
  background-color: #4caf50;
  color: #fff;
}

.v-btn.primary:hover {
  background-color: #388e3c;
}

.v-btn.error {
  background-color: #f44336;
  color: #fff;
}

.v-btn.error:hover {
  background-color: #c62828;
}

@media screen and (min-width: 768px) {
  .v-col.md-6 {
    max-width: 50%;
  }
}

@media screen and (max-width: 767px) {
  .v-text-field {
    margin-bottom: 0.5rem;
  }

  .v-card-actions {
    flex-direction: column;
  }

  .v-card-actions button {
    margin-bottom: 1rem;
  }
}
</style>
