import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

test('mazadi tasks', () => {
    const wrapper = mount(HelloWorld);
    expect(wrapper.text()).toContain('Welcome');
  });