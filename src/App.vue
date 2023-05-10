<template>
  <keep-alive>
    <div
      v-if="!isViewAllPattern"
      id="app"
      @click-outside="handleDeleteClickOutside"
    >
      <div class="whole-screen">
        <div class="left-section">
          <div class="menu">
            <span id="file-title">Mobile UI Design Tool</span>
          </div>

          <div class="dropdown-wrapper">
            <span id="pattern-selection">Patterns name:</span><br />
            <button
              id="selectButton"
              class="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedPattern }}
            </button>
            <ul class="dropdown-menu">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for pattern.."
              />
              <span v-if="filteredPatterns.length == 0">No Data Available</span>
              <li
                v-for="(pattern, index) in uniquePatterns"
                :key="'pattern-' + index"
              >
                <a class="dropdown-item" @click="selectItem(pattern)">{{
                  pattern
                }}</a>
              </li>
            </ul>
          </div>
          <div
            class="bg-white p-3 overflow-auto"
            id="pattern-area"
            style="
              height: 500px;
              max-width: 500px;
              margin: 15px;
              margin-top: 20px;
            "
          >
            <draggable
              v-model="filteredImages"
              group="pattern"
              @start="drag = true"
              @end="drag = false"
              item-key="id"
            >
              <template #item="{ element, index }">
                <div>
                  <img
                    id="imgHover"
                    @mousemove="
                      hoveredIndex = index;
                      handleImageHover(index);
                    "
                    @mouseleave="
                      hoveredIndex = null;
                      handleImageClick(index);
                    "
                    @click="handleImageClick(index)"
                    :src="element.images"
                    alt="Image"
                    style="max-width: 100%; max-height: 100%"
                  />
                  <hr />
                </div>
              </template>
            </draggable>
          </div>
          <div v-if="showDeleteModal" class="delete-image">
            <p>Are you sure you want to delete this image?</p>
            <div class="button-container">
              <button class="btn btn-secondary" @click="handleCancelDelete">
                No
              </button>
              <button
                class="btn btn-outline-danger"
                @click="handleConfirmDelete(this.selectedImageToDeleteIndex)"
              >
                Yes
              </button>
            </div>
          </div>
          <div style="text-align: center">
            <button
              v-if="showDeleteButton"
              class="btn btn-outline-danger"
              @click="handleDeleteClick"
            >
              Delete
            </button>
          </div>

          <div class="upload-section">
            <div>
              Please click this button below to upload new pattern<br /><br />
              <v-btn color="primary" @click="this.dialogVisible = true"
                >Upload File</v-btn
              >
              <MultipleUploads
                @components-loaded="onComponentsLoaded"
                :dialog-visible="dialogVisible"
                @info-entered="infoEntered"
              />
            </div>
          </div>
        </div>
        <div class="right-section">
          <section class="description-wrapper">
            <div class="description-area">
              <div class="description-item">
                <div style="display: flex; align-items: center">
                  <h3
                    style="
                      margin: 8px 0;
                      font-style: italic;
                      text-decoration: underline;
                      font-weight: bold;
                    "
                  >
                    Pattern description
                  </h3>
                  <a
                    href="#"
                    class="edit-button"
                    v-if="selectedImage.length != 0"
                    @click.prevent="editPattern"
                    >Click for full view..
                  </a>
                </div>

                <div class="description-content">
                  <ul>
                    <div class="value">
                      Pattern name:{{ selectedImage.name }}
                    </div>
                    <div class="value">Problem:{{ selectedImage.problem }}</div>
                    <div class="value">
                      Solution:{{ selectedImage.context }}
                    </div>
                    <div class="value">
                      Context:{{ selectedImage.solution }}
                    </div>
                    <div class="value">
                      Rationale:{{ selectedImage.rationale }}
                    </div>
                    <div class="value">
                      Examples:{{ selectedImage.examples }}
                    </div>
                    <li v-if="patternsArray.length === 0">
                      No components added yet.
                    </li>
                  </ul>
                </div>
              </div>

              <div class="attributes-item">
                <h5 style="margin: 4px 0; font-style: italic; margin-top: 43px">
                  Usability attributes:
                </h5>
                <div class="description-content">
                  <ul>
                    <div>Learnability: {{ selectedImage.learnability }}</div>
                    <div>Efficiency:{{ selectedImage.efficiency }}</div>
                    <div>Satisfaction: {{ selectedImage.satisfaction }}</div>
                    <div>Reliability: {{ selectedImage.reliability }}</div>
                    <div>Desirability:{{ selectedImage.desirability }}</div>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <canvas-component
            :dropped-items="droppedItems"
            :patternsArray="patternsArray"
            :view-data="views"
          />
          <div ref="canvasView"></div>
        </div>
      </div>
    </div>
  </keep-alive>
  <router-view
    v-if="isViewAllPattern"
    @pattern-updated="updatePattern"
  ></router-view>
</template>

<script>
import VueDragResize from "vue3-drag-resize";
import draggable from "vuedraggable";
import Canvas from "./components/Canvas.vue";
import MultipleUploads from "./components/MultipleUploads.vue";
import PatternDetails from "./components/PatternDetails.vue";

export default {
  name: "App",
  components: {
    CanvasComponent: Canvas,
    VueDragResize,
    MultipleUploads,
    PatternDetails,
    draggable,
  },
  data() {
    return {
      searchQuery: "",
      selectedPattern: "Select Pattern", //Showing on dropdown menu
      selectedImageToDeleteIndex: null,
      showDeleteButton: false,
      showDeleteModal: false,
      dialogVisible: false,
      hoveredIndex: null,
      patternsArray: [], //Store all kind of pattern and its information
      selectedImage: [], //Store the particular pattern and its information
      imgAppBarTop: [], //Store all kind of App-bar:Top Image
      imgBtmNav: [], //Store all kind of Bottom navigation Image
      imgBtn: [],
      imgAppBarBtm: [],
      imgList: [],
      imgTextField: [],
      views: [
        {
          name: "View 1",
          data: {
            items: [],
            score_learnability: 0,
            score_efficiency: 0,
            score_satisfaction: 0,
            score_reliability: 0,
            score_desirability: 0,
            loadedImages: [],
          },
        },
        {
          name: "View 2",
          data: {
            items: [],
            score_learnability: 0,
            score_efficiency: 0,
            score_satisfaction: 0,
            score_reliability: 0,
            score_desirability: 0,
            loadedImages: [],
          },
        },
      ],
      isViewAllPattern: false,
      isUpdating: false,
      drag: false,
    };
  },
  computed: {
    uniquePatterns() {
      const patternNames = this.patternsArray.map((pattern) => pattern.name);
      const uniqueNames = [...new Set(patternNames)];
      return uniqueNames;
    },
    filteredImages() {
      if (!this.selectedPattern) {
        return [];
      }
      console.log(this.patternsArray);
      const pattern = this.patternsArray.find(
        (p) => p.name === this.selectedPattern
      );
      if (!pattern) {
        return [];
      }
      if (pattern.name === "App-bar:Top") {
        return this.imgAppBarTop;
      } else if (pattern.name === "Bottom navigation") {
        return this.imgBtmNav;
      } else if (pattern.name === "Buttons") {
        return this.imgBtn;
      } else if (pattern.name === "App-bar:Bottom") {
        return this.imgAppBarBtm;
      } else if (pattern.name === "List") {
        return this.imgList;
      } else if (pattern.name === "Text Field") {
        return this.imgTextField;
      } else {
        return [];
      }
    },
    filteredPatterns() {
      return this.patternsArray.filter((pattern) => {
        if (pattern && pattern.name) {
          return pattern.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        }
        return false;
      });
    },
  },
  methods: {
    editPattern() {
      this.$router.push({
        name: "pattern-details",
        query: {
          id: this.selectedImage.id,
          name: this.selectedImage.name,
          problem: this.selectedImage.problem,
          context: this.selectedImage.context,
          solution: this.selectedImage.solution,
          rationale: this.selectedImage.rationale,
          examples: this.selectedImage.examples,
          learnability: this.selectedImage.learnability,
          efficiency: this.selectedImage.efficiency,
          satisfaction: this.selectedImage.satisfaction,
          reliability: this.selectedImage.reliability,
          desirability: this.selectedImage.desirability,
        },
      });
      this.isViewAllPattern = true;
    },
    async updatePattern(updatedPattern) {
      console.log(updatedPattern.id);
      const pattern = this.patternsArray.find((p) => p.id == updatedPattern.id);
      console.log(pattern);
      if (pattern) {
        pattern.name = updatedPattern.name;
        pattern.problem = updatedPattern.problem;
        pattern.context = updatedPattern.context;
        pattern.solution = updatedPattern.solution;
        pattern.rationale = updatedPattern.rationale;
        pattern.examples = updatedPattern.examples;
        pattern.learnability = updatedPattern.learnability;
        pattern.efficiency = updatedPattern.efficiency;
        pattern.satisfaction = updatedPattern.satisfaction;
        pattern.reliability = updatedPattern.reliability;
        pattern.desirability = updatedPattern.desirability;

        // Make API call to update pattern in the database
        try {
          const response = await fetch(`/components/${pattern.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pattern),
          });

          if (!response.ok) {
            throw new Error("Failed to update pattern");
          }

          await response.json();
          this.isUpdating = true;
        } catch (error) {
          console.error(error);
        }
      }
    },
    handleImageHover(index) {
      if (index === this.hoveredIndex) {
        this.selectedImageToDeleteIndex = index;
        const clickedImage = this.filteredImages[index];
        console.log(clickedImage);
        if (clickedImage) {
          for (const pattern of this.patternsArray) {
            if (pattern.id === clickedImage.id) {
              console.log(this.selectedImage);
              this.selectedImage = pattern;
              console.log(this.selectedImage.id);
              return;
            }
          }
        }
      }
    },
    handleImageClick(index) {
      if (index === this.hoveredIndex) {
        this.selectedImageToDeleteIndex = index;
        this.showDeleteButton = true;

        const clickedImage = this.filteredImages[index];
        console.log(clickedImage);
        if (clickedImage) {
          for (const pattern of this.patternsArray) {
            if (pattern.id === clickedImage.id) {
              console.log(this.selectedImage);
              this.selectedImage = pattern;
              console.log(this.selectedImage.id);
              return;
            }
          }
        }
      }
    },
    handleDeleteClickOutside() {
      this.showDeleteButton = false;
      this.showDeleteModal = false;
    },
    handleDeleteClick() {
      this.showDeleteModal = true;
      this.showDeleteButton = false;
    },
    handleConfirmDelete(index) {
      // Search for the image with the given id in the corresponding root array
      let imagesArray;
      if (this.selectedPattern === "App-bar:Top") {
        imagesArray = this.imgAppBarTop;
      } else if (this.selectedPattern === "Bottom navigation") {
        imagesArray = this.imgBtmNav;
      } else if (this.selectedPattern === "Buttons") {
        imagesArray = this.imgBtn;
      } else if (this.selectedPattern === "App:bar:Bottom") {
        imagesArray = this.imgAppBarBtm;
      } else if (this.selectedPattern === "List") {
        imagesArray = this.imgList;
      } else if (this.selectedPattern === "Text Field") {
        imagesArray = this.imgTextField;
      }
      const image = imagesArray[index];
      fetch(`/components/image/${image.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.showDeleteModal = false;
          alert("Image deleted successfully!");
          imagesArray.splice(index, 1);

          // Remove the image from patternsArray as well
          for (let i = 0; i < this.patternsArray.length; i++) {
            const pattern = this.patternsArray[i];
            if (pattern.id === image.id) {
              this.patternsArray.splice(i, 1);
              break;
            }
          }
        })
        .catch((error) => console.error("Error deleting image:", error));

      // Remove the image from the filteredImages array as well
      location.reload();
    },

    handleCancelDelete() {
      this.selectedImageToDeleteIndex = null;
      this.showDeleteButton = false;
      this.showDeleteModal = false;
    },
    selectItem(pattern) {
      this.selectedPattern = pattern;
      this.showDeleteButton = false;
      this.showDeleteModal = false;
    },
    async infoEntered(info) {
      if (!info) {
        this.components.push(info);
        this.dialogVisible = false;
      } else {
        this.dialogVisible = false;
      }
    },
    resize({ top, left, width, height }) {
      this.top = top;
      this.left = left;
      this.width = width;
      this.height = height;
    },
    onComponentsLoaded(components) {
      console.log(components);
      this.patternsArray.push(components);
      console.log(this.patternsArray);
      location.reload();
    },
    fetchData() {
      console.log("Fetching Data again");
      fetch("/components/image/" + encodeURIComponent("App-bar:Top"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "App-bar:Top",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgAppBarTop.push(image);
          }
          console.log("Success app-bar");
          console.log(this.imgAppBarTop);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Bottom navigation"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Bottom navigation",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgBtmNav.push(image);
          }
          console.log("Success btm-nav");
          console.log(this.imgBtmNav);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Buttons"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Buttons",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgBtn.push(image);
          }
          console.log("Success btn");
          console.log(this.imgBtn);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("App-bar:Bottom"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "App-bar:Bottom",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgAppBarBtm.push(image);
          }
          console.log("Success App-bar:Bottom");
          console.log(this.imgAppBarBtm);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("List"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "List",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgList.push(image);
          }
          console.log("Success List");
          console.log(this.imgList);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Text Field"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Text Field",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgTextField.push(image);
          }
          console.log("Success Text Field");
          console.log(this.imgTextField);
        })
        .catch((error) => console.log(error));

      fetch("/components/")
        .then((response) => response.json())
        .then(async (data) => {
          try {
            data.forEach(async (component) => {
              const {
                name,
                problem,
                context,
                solution,
                rationale,
                examples,
                learnability,
                efficiency,
                satisfaction,
                reliability,
                desirability,
                id,
              } = component;
              this.patternsArray.push({
                name,
                problem,
                context,
                solution,
                rationale,
                examples,
                learnability,
                efficiency,
                satisfaction,
                reliability,
                desirability,
                id,
              });
            });

            this.patternsArray.sort((a, b) => {
              const nameA = a.name ? a.name.toUpperCase() : "";
              const nameB = b.name ? b.name.toUpperCase() : "";
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });

            console.log(this.patternsArray);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    if (!this.isUpdating) {
      fetch("/components/image/" + encodeURIComponent("App-bar:Top"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "App-bar:Top",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgAppBarTop.push(image);
          }
          console.log("Success app-bar");
          console.log(this.imgAppBarTop);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Bottom navigation"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Bottom navigation",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgBtmNav.push(image);
          }
          console.log("Success btm-nav");
          console.log(this.imgBtmNav);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Buttons"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Buttons",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgBtn.push(image);
          }
          console.log("Success btn");
          console.log(this.imgBtn);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("App-bar:Bottom"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "App-bar:Bottom",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgAppBarBtm.push(image);
          }
          console.log("Success App-bar:Bottom");
          console.log(this.imgAppBarBtm);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("List"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "List",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgList.push(image);
          }
          console.log("Success List");
          console.log(this.imgList);
        })
        .catch((error) => console.log(error));

      fetch("/components/image/" + encodeURIComponent("Text Field"))
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.imgSrc.length; i++) {
            const image = {
              name: "Text Field",
              images: data.imgSrc[i],
              id: data.id[i],
            };
            this.imgTextField.push(image);
          }
          console.log("Success Text Field");
          console.log(this.imgTextField);
        })
        .catch((error) => console.log(error));

      fetch("/components/")
        .then((response) => response.json())
        .then(async (data) => {
          try {
            data.forEach(async (component) => {
              const {
                name,
                problem,
                context,
                solution,
                rationale,
                examples,
                learnability,
                efficiency,
                satisfaction,
                reliability,
                desirability,
                id,
              } = component;
              this.patternsArray.push({
                name,
                problem,
                context,
                solution,
                rationale,
                examples,
                learnability,
                efficiency,
                satisfaction,
                reliability,
                desirability,
                id,
              });
            });

            this.patternsArray.sort((a, b) => {
              const nameA = a.name ? a.name.toUpperCase() : "";
              const nameB = b.name ? b.name.toUpperCase() : "";
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });

            console.log(this.patternsArray);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    } else {
      this.isUpdating = false; // reset the flag to false
    }
  },
};
</script>
<style>
html {
  /* Overlapping Stripes Background, based off https://codepen.io/MinzCode/pen/Exgpqpe */
  --color1: rgba(55, 165, 255, 0.35);
  --color2: rgba(96, 181, 250, 0.35);
  --rotation: 135deg;
  --size: 10px;
  background-blend-mode: multiply;
  background-image: repeating-linear-gradient(
      var(--rotation),
      var(--color1) calc(var(--size) * 0),
      var(--color1) calc(var(--size) * 9),
      var(--color2) calc(var(--size) * 9),
      var(--color2) calc(var(--size) * 12),
      var(--color1) calc(var(--size) * 12)
    ),
    repeating-linear-gradient(
      calc(var(--rotation) + 90deg),
      var(--color1) calc(var(--size) * 0),
      var(--color1) calc(var(--size) * 9),
      var(--color2) calc(var(--size) * 9),
      var(--color2) calc(var(--size) * 12),
      var(--color1) calc(var(--size) * 12)
    );
}
</style>

<style scoped lang="stylus">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;

}

.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: #ffffff55;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: .2s ease;
  text-align: center;
  &[data-active=true] {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: #ffffffcc;
  }
}

label {
  font-size: 36px;
  cursor: pointer;
  display: block;

  span {
    display: block;
  }

  input[type=file]:not(:focus-visible) {
    // Visually Hidden Styles taken from Bootstrap 5
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  .smaller {
    font-size: 16px;
  }
}

.image-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
}

#upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
}

button {
  cursor: pointer;
}
</style>
