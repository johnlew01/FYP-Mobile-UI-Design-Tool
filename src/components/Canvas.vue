<template>
  <div class="canvas-area">
    <div v-for="(view, index) in viewData">
      <div v-if="this.currentView === viewData[index].name">
        <div class="phone" id="phone">
          <div class="screen">
            <!-- End-user can add and customize content here -->
            <div class="element">
              <draggable
                :list="viewData[index].data.items"
                group="pattern"
                :options="{ animation: 100 }"
                v-droppable:pattern
                style="height: 500px; width: 100px"
              >
                <template #item="{ element }">
                  <VueDragResize
                    :parentH="570"
                    :parentW="276"
                    :parentLimitation="true"
                    :snapToGrid="true"
                    :gridX="1"
                    :gridY="1"
                    v-on:resizing="resize"
                    v-on:dragging="resize"
                    dropzone="pattern"
                    @mouseup="
                      selectedImage = element;
                      selectedImageIndex = index;
                    "
                    @click="
                      selectedImage = element;
                      selectedImageIndex = index;
                    "
                  >
                    <img
                      :src="element.images"
                      alt="Image"
                      @load="onImageLoad(element, index)"
                    />
                  </VueDragResize>
                </template>
              </draggable>
            </div>
          </div>
        </div>
        <div class="impact-box">
          Learnability: {{ this.learnabilityScore(index) }}<br />
          Efficiency: {{ this.efficiencyScore(index) }}<br />
          Satisfaction: {{ this.satisfactionScore(index) }} <br />
          Reliability: {{ this.reliabilityScore(index) }}<br />
          Desirability: {{ this.desirabilityScore(index) }}<br />
        </div>
      </div>

      <div class="tab-bar">
        <div
          style="border-color: gainsboro"
          v-for="(view, index) in viewData"
          :key="index"
          @click="switchView(viewData[index].name)"
          :class="{ tab: true, active: viewData[index].name === currentView }"
          @dblclick="editTabName(index)"
        >
          <span v-if="!editingTabName(index)">{{ viewData[index].name }}</span>
          <input
            v-else
            class="edit-tab-name-input"
            type="text"
            v-model="editedTabName"
            @keyup.enter="finishEditingTabName"
            @blur="finishEditingTabName"
          />
          <span id="close-view" title="Delete View">
            <svg
              @click="closeView(viewData[index].name)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
              />
            </svg>
          </span>
        </div>

        <div class="toolbar">
          <!-- New wireframe -->
          <span id="add-view" title="Add View">
            <svg
              @click="addView"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-plus-square"
              viewBox="0 0 16 16"
              title="Add View"
            >
              <path
                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
              />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>
          </span>
          <!-- Save file -->
          <span id="save-current-view" title="Save Current View">
            <svg
              @click="saveCurrentView"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-save2"
              viewBox="0 0 16 16"
            >
              <path
                d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"
              />
            </svg>
          </span>
          <span id="delete-selected-image" title="Delete selected image">
            <svg
              @click="deleteItem(this.selectedImage, this.selectedImageIndex)"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
              />
              <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import VueDragResize from "vue3-drag-resize";
import draggable from "vuedraggable";
import vDroppable from "vuedraggable/dist/vuedraggable.umd.min.js";
export default {
  components: {
    VueDragResize,
    draggable,
  },
  directives: {
    droppable: vDroppable.droppable,
  },
  props: {
    viewData: {
      type: Array,
      required: true,
    },
    patternsArray: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      currentView: "View 1",
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      editedTabIndex: -1,
      editedTabName: "",
      loadedImages: [],
      selectedImage: null,
      selectedImageIndex: null,
    };
  },

  methods: {
    reliabilityScore(index) {
      const score = this.viewData[index].data.score_reliability;
      return score > 0 ? score : 0;
    },
    learnabilityScore(index) {
      const score = this.viewData[index].data.score_learnability;
      return score > 0 ? score : 0;
    },
    efficiencyScore(index) {
      const score = this.viewData[index].data.score_efficiency;
      return score > 0 ? score : 0;
    },
    satisfactionScore(index) {
      const score = this.viewData[index].data.score_satisfaction;
      return score > 0 ? score : 0;
    },
    desirabilityScore(index) {
      const score = this.viewData[index].data.score_desirability;
      return score > 0 ? score : 0;
    },
    editingTabName(index) {
      return this.editedTabIndex === index;
    },
    editTabName(index) {
      this.editedTabIndex = index;
      this.editedTabName = this.viewData[index].name;
      this.$nextTick(() => {
        const input = this.$el.querySelector(".edit-tab-input");
        input.focus();
        document.addEventListener("click", this.handleOutsideClick);
      });
    },
    handleOutsideClick(event) {
      const container = this.$el.querySelector(".container");
      if (!container.contains(event.target)) {
        this.finishEditingTabName(event);
      }
    },
    finishEditingTabName(event) {
      if (
        (event.type === "click" || event.keyCode === 13) &&
        this.editedTabName.trim()
      ) {
        this.viewData[this.editedTabIndex].name = this.editedTabName.trim();
        this.switchView(this.editedTabName.trim());
      } else {
        console.log(this.editedTabIndex);
        this.viewData[this.editedTabIndex].name = this.editedTabName.trim();
      }
      this.editedTabIndex = -1;
      this.editedTabName = "";

      document.removeEventListener("click", this.handleOutsideClick);
    },
    addView() {
      const newViewName = prompt("Enter new view name");
      if (newViewName) {
        const existingView = this.viewData.find(
          (view) => view.name === newViewName
        );
        if (!existingView) {
          const newView = {
            name: newViewName,
            data: {
              items: [],
              score_learnability: 0,
              score_efficiency: 0,
              score_satisfaction: 0,
              score_reliability: 0,
              score_desirability: 0,
              loadedImages: [],
            },
          };
          this.viewData.push(newView);
          this.currentView = newViewName;
          console.log(this.viewData);
        } else {
          alert("View already exists");
        }
      }
    },
    switchView(viewName) {
      console.log(this.viewData);
      if (this.currentView !== viewName) {
        this.currentView = viewName;
        localStorage.setItem("currentView", this.currentView);
      }
    },
    closeView(viewName) {
      const viewIndex = this.viewData.findIndex(
        (view) => view.name === viewName
      );
      if (viewIndex >= 0) {
        this.viewData.splice(viewIndex, 1);
        // Check if closed view was current view
        if (this.currentView === viewName) {
          // Set current view to first available view
          this.currentView =
            this.viewData.length > 0 ? this.viewData[0].name : "";
          localStorage.setItem("currentView", this.currentView);
        }
      }
    },
    saveCurrentView() {
      console.log(this.currentView);
      const self = this;
      window.html2canvas = html2canvas;
      var doc = new jsPDF("p", "pt", "a4");
      const content = document.querySelector("#phone");
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Calculate the position of the content
      const x = (pageWidth - contentWidth) / 2;
      const y = (pageHeight - contentHeight) / 2;

      doc.html(content, {
        x: x,
        y: y,
        callback: function (pdf) {
          pdf.save(self.currentView + ".pdf");
        },
      });
    },
    onImageLoad(element, viewIndex) {
      const view = this.viewData[viewIndex];
      if (!view.data.loadedImages.includes(element)) {
        console.log("Item dropped:", element);
        const pattern = this.patternsArray.find(
          (pattern) => pattern.id === element.id
        );
        console.log(pattern); // find the pattern in the patternsArray
        if (pattern) {
          if (pattern.learnability === "GOOD") {
            view.data.score_learnability++;
          } else if (pattern.learnability === "BAD") {
            view.data.score_learnability--;
          }
          if (pattern.efficiency === "GOOD") {
            view.data.score_efficiency++;
          } else if (pattern.efficiency === "BAD") {
            view.data.score_efficiency--;
          }
          if (pattern.satisfaction === "GOOD") {
            view.data.score_satisfaction++;
          } else if (pattern.satisfaction === "BAD") {
            view.data.score_satisfaction--;
          }
          if (pattern.reliability === "GOOD") {
            view.data.score_reliability++;
          } else if (pattern.reliability === "BAD") {
            view.data.score_reliability--;
          }
          if (pattern.desirability === "GOOD") {
            view.data.score_desirability++;
          } else if (pattern.desirability === "BAD") {
            view.data.score_desirability--;
          }
          console.log(view);
          view.data.loadedImages.push(element);
        } else {
          console.log(this.viewData);
          view.data.loadedImages.push(element);
        }
      }

      console.log(this.viewData);
    },
    deleteItem(element, viewIndex) {
      console.log(element);
      const view = this.viewData[viewIndex];
      const index = view.data.loadedImages.indexOf(element);
      console.log(index);
      if (index > -1) {
        const pattern = this.patternsArray.find(
          (pattern) => pattern.id === element.id
        );
        if (pattern) {
          if (pattern.learnability === "GOOD") {
            view.data.score_learnability--;
          } else if (pattern.learnability === "BAD") {
            view.data.score_learnability++;
          }
          if (pattern.efficiency === "GOOD") {
            view.data.score_efficiency--;
          } else if (pattern.efficiency === "BAD") {
            view.data.score_efficiency++;
          }
          if (pattern.satisfaction === "GOOD") {
            view.data.score_satisfaction--;
          } else if (pattern.satisfaction === "BAD") {
            view.data.score_satisfaction++;
          }
          if (pattern.reliability === "GOOD") {
            view.data.score_reliability--;
          } else if (pattern.reliability === "BAD") {
            view.data.score_reliability++;
          }
          if (pattern.desirability === "GOOD") {
            view.data.score_desirability--;
          } else if (pattern.desirability === "BAD") {
            view.data.score_desirability++;
          }
        }

        console.log(this.viewData);
      }

      view.data.items.splice(index, 1);
      if (view.data.loadedImages.length > 0) {
        view.data.loadedImages.splice(index, 1);
      } else if ((view.data.loadedImages.length = 0)) {
        console.log("loaded images array is empty now");
      }
    },

    resize({ top, left, width, height }) {
      this.top = top;
      this.left = left;
      this.width = width;
      this.height = height;
    },
  },
};
</script>

<style>
.canvas-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120vh;
  background-color: #f1f1f1;
}

.phone {
  position: relative;
  width: 300px;
  height: 600px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
  overflow: hidden;
  background-color: darkgray;
}

.screen {
  position: absolute;
  padding: 5px;
  top: 15px;
  left: 12px;
  right: 12px;
  bottom: 15px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.element {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 5px;
}

.vue-drag-resize {
  padding: 0;
  max-height: min-content;
  height: 40px;
  /* change this to your desired value */
}

h1 {
  margin: 20px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
}

p {
  margin: 10px 20px;
  font-size: 16px;
  line-height: 1.4;
  text-align: justify;
}

.btn {
  display: block;
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.tab-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #f2f2f2;
  padding: 0px;
  z-index: 1;
  width: 100%;
}

.tab {
  padding: 5px 10px;
  margin: 0px;
  background-color: #e0e0e0;
  border-radius: 0 0 5px 5px;
  cursor: pointer;
}

.tab.active {
  background-color: white;
}

.edit-tab-name-input {
  border: 1px solid #ccc;
  padding: 2px 4px;
  font-size: 16px;
}

.edit-tab-name-input::placeholder {
  color: #ccc;
}

.edit-tab-name-input:focus {
  border-color: #0066cc;
  outline: none;
}

.edit-tab-name-input::-webkit-input-placeholder {
  /* Safari/Chrome specific CSS */
  color: #ccc;
  opacity: 1;
}

.edit-tab-name-input::-moz-placeholder {
  /* Firefox specific CSS */
  color: #ccc;
  opacity: 1;
}

.edit-tab-name-input:-ms-input-placeholder {
  /* IE/Edge specific CSS */
  color: #ccc;
  opacity: 1;
}

#add-view:hover svg,
#save-current-view:hover svg,
#delete-selected-image:hover svg {
  width: 26px;
  height: 26px;
}
</style>
