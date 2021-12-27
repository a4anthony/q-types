import AppLayout from "../../components/layouts/AppLayout";
import PageContainer from "../../components/containers/PageContainer";
import DualViewQuestionContainer from "../../components/containers/DualViewQuestionContainer";
import QuestionHeader from "../../components/helpers/QuestionHeader";
import QuestionActions from "../../components/helpers/QuestionActions";
export default {
  title: "Layout/containers/Dual view question container",
  component: DualViewQuestionContainer,
};

import data from "../../data";

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    AppLayout,
    PageContainer,
    DualViewQuestionContainer,
    QuestionHeader,
    QuestionActions,
  },
  computed: {
    data() {
      return data;
    },
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    "<app-layout>" +
    "<page-container>" +
    "<template v-slot:header>" +
    "<question-header v-bind='data.questionHeaderArgs' />" +
    "</template>" +
    "<template v-slot:content>" +
    '<dual-view-question-container v-bind="args">' +
    "<template v-slot:right-content>" +
    "<div class='qt-h-52 qt-bg-pink-300 qt-flex qt-justify-center qt-items-center'>Answer Component</div>" +
    "</template>" +
    "<template v-slot:left-content>" +
    "<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dolorum est facilis harum ipsam maxime molestiae quaerat quibusdam sed? Accusantium amet autem doloribus eveniet facere ipsum, iste laudantium minima nesciunt obcaecati odit officia repellat sed sit sunt veniam voluptatum! A asperiores assumenda autem blanditiis culpa debitis delectus distinctio dolore dolorem ducimus eaque earum esse excepturi harum, impedit iste itaque, libero maxime modi molestias nemo porro possimus quae quam quas quod, voluptates. Adipisci aliquid autem corporis dolor dolorum hic quaerat qui quia quo ratione reiciendis sint veritatis, vero. Enim in perspiciatis possimus praesentium quod? Commodi cumque doloribus eius enim eum inventore magni quam, voluptas voluptate voluptates! Alias beatae cupiditate deserunt dignissimos doloribus esse eveniet, excepturi illo iure, iusto laboriosam libero molestiae nihil nisi, provident ratione totam voluptate. Aperiam architecto aspernatur consequatur, culpa cupiditate deserunt dicta, exercitationem incidunt iusto molestiae nulla obcaecati perspiciatis qui recusandae rem repellendus voluptatum. Aliquid autem commodi cum dicta dignissimos eos eveniet expedita fugiat hic iusto laborum magnam modi molestiae mollitia nam neque perferendis provident, quae quasi repellat totam, voluptatem voluptatibus. Ab accusamus aliquid architecto asperiores assumenda aut beatae culpa debitis deserunt distinctio eaque eligendi eveniet ex labore minima numquam quas quasi qui quisquam soluta sunt tenetur, veritatis voluptate. Assumenda impedit minima voluptatibus? Ad atque blanditiis consequatur consequuntur culpa cumque debitis distinctio dolorem eveniet fuga fugit nam omnis, perspiciatis possimus quisquam reprehenderit saepe, vitae. Ab accusantium aliquid amet aperiam corporis debitis deleniti dolor dolore doloremque ducimus enim excepturi exercitationem explicabo facilis hic incidunt ipsum laudantium maxime minima natus neque nostrum officiis placeat praesentium quae qui quia quos reiciendis rem repudiandae rerum sequi suscipit tempora ullam vel, veniam voluptatum. Cum dicta ex fugit maxime nostrum, optio quis rem sed temporibus. Architecto consequatur error esse laborum magnam natus, nemo odio officia praesentium quidem quod quos repellat saepe, sint sit temporibus ullam voluptas voluptatem. Consequatur cupiditate dolore expedita id neque, odit porro quaerat quod recusandae reiciendis repudiandae saepe, soluta ullam ut vel! Adipisci, at consectetur corporis debitis deleniti, deserunt eius et expedita facere id itaque iure magnam maxime nihil obcaecati optio perspiciatis placeat porro quam quas quod repellendus repudiandae sapiente similique tempore velit, vero voluptas. Ab accusantium alias amet blanditiis consectetur dolor, dolorem ea error esse eum excepturi illum impedit iure magnam magni modi molestias, nam nemo nihil odio porro praesentium provident quaerat quis quisquam reiciendis repellendus sapiente tempore temporibus tenetur ullam vel voluptas voluptate? Esse eum officiis omnis sunt vel!</div>" +
    "</template>" +
    "</dual-view-question-container>" +
    "</template>" +
    "<template v-slot:footer-right>" +
    "<question-actions v-bind='data.questionActionArgs' />" +
    "</template>" +
    "</page-container>" +
    "</app-layout>",
});

export const primary = Template.bind({});
primary.args = {
  grayBackground: true,
};

primary.parameters = {
  layout: "fullscreen",
};
