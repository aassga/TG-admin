<template>
    <div>
        <div class="v2-search bb mb10">
            <ButtonGroup class="repay-button" style="margin-bottom:.3px !important">
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'shixun';
                        }
                    "
                    :class="currentBtn == 'shixun' ? 'active' : ''"
                    >视讯</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'qipai';
                        }
                    "
                    :class="currentBtn == 'qipai' ? 'active' : ''"
                    >棋牌</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'dianzi';
                        }
                    "
                    :class="currentBtn == 'dianzi' ? 'active' : ''"
                    >电子</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'caipiao';
                        }
                    "
                    :class="currentBtn == 'caipiao' ? 'active' : ''"
                    >彩票</Button
                >
            </ButtonGroup>
        </div>
        <LiveLevel v-show="currentBtn == 'shixun'"></LiveLevel>
        <OtherTypeLevel :type="currentBtn" v-show="currentBtn != 'shixun'"></OtherTypeLevel>
    </div>
</template>
<script>
import LiveLevel from '../components/live-level';
import OtherTypeLevel from '../components/other-type-level';
export default {
    name: 'levelManagement',
    components: {
        LiveLevel,
        OtherTypeLevel
    },
    data() {
        return {
            currentBtn: 'shixun'
        };
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
</style>


